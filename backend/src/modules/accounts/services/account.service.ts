import { prisma } from '../../../config/database';
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from '../../../common/errors/AppError';
import { encryptAES, encryptVaultField } from '../../../common/utils/crypto';
import { Prisma } from '@prisma/client';
import { orderService } from '../../orders/services/order.service';

export interface CreateAccountDTO {
  gameId: string;
  title: string;
  description?: string;
  price: number;
  serverRegion: string;
  rankLevel?: string;
  deliveryType?: 'instant' | 'manual';
  isPlatformOwned?: boolean;
  binds?: Array<{
    bindProvider: string;
    bindStatus: string;
    note?: string;
  }>;
  images?: Array<{
    imageUrl: string;
    isPrimary?: boolean;
  }>;
  credentials: {
    loginIdentifier: string;
    loginPassword: string;
    backupCodes?: string;
    extraInstructions?: string;
  };
  ipAddress?: string;
  userAgent?: string;
}

export interface UpdateAccountDTO {
  title?: string;
  description?: string;
  price?: number;
  serverRegion?: string;
  rankLevel?: string;
  deliveryType?: 'instant' | 'manual';
  binds?: Array<{
    bindProvider: string;
    bindStatus: string;
    note?: string;
  }>;
  images?: Array<{
    imageUrl: string;
    isPrimary?: boolean;
  }>;
}

export interface QueryAccountFilters {
  gameId?: string;
  platform?: string;
  minPrice?: number;
  maxPrice?: number;
  serverRegion?: string;
  rankLevel?: string;
  deliveryType?: string;
  isPlatformOwned?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sort?: 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'popular';
}

export class AccountService {
  /**
   * Create new game account listing with Zero-Knowledge AES-256-GCM Vault
   */
  async createListing(sellerId: string, userRole: string, data: CreateAccountDTO) {
    const gameIdBigInt = BigInt(data.gameId);
    const sellerIdBigInt = BigInt(sellerId);

    // 1. Verify Game exists & is active
    const game = await prisma.game.findUnique({
      where: { id: gameIdBigInt },
    });
    if (!game || !game.isActive) {
      throw new NotFoundError('Selected game does not exist or is currently disabled');
    }

    // 2. Only admin can create B2C platform-owned listings
    const isPlatformOwned = userRole === 'admin' ? Boolean(data.isPlatformOwned) : false;

    // 3. Encrypt credentials via AES-256-GCM Vault
    const { loginIdentifier, loginPassword, backupCodes, extraInstructions } = data.credentials;

    const encryptedIdStr = encryptVaultField(loginIdentifier);
    const encryptedPassStr = encryptVaultField(loginPassword);
    const encryptedCodesStr = backupCodes ? encryptVaultField(backupCodes) : null;
    const [passIv, passTag] = encryptedPassStr.split(':');

    // Prevent duplicate listing creation if identical listing was submitted in the last 5 seconds
    const recentDuplicate = await prisma.gameAccount.findFirst({
      where: {
        sellerId: sellerIdBigInt,
        gameId: gameIdBigInt,
        title: data.title,
        createdAt: { gte: new Date(Date.now() - 5000) },
      },
    });

    if (recentDuplicate) {
      return this.getListingById(recentDuplicate.id.toString(), sellerId);
    }

    // 4. Atomic transaction to create Account, Binds, Images, and Vault Credentials
    const listing = await prisma.$transaction(async (tx) => {
      // Create Game Account
      const account = await tx.gameAccount.create({
        data: {
          sellerId: sellerIdBigInt,
          gameId: gameIdBigInt,
          title: data.title,
          description: data.description,
          price: new Prisma.Decimal(data.price),
          serverRegion: data.serverRegion,
          rankLevel: data.rankLevel,
          deliveryType: data.deliveryType || 'instant',
          isPlatformOwned,
          status: 'available',
        },
      });

      // Store in AES-256-GCM Vault
      await tx.accountCredential.create({
        data: {
          gameAccountId: account.id,
          keyVersion: 1,
          initializationVector: passIv, // 16 bytes hex
          authTag: passTag, // 16 bytes hex
          encryptedLoginIdentifier: encryptedIdStr,
          encryptedLoginPassword: encryptedPassStr,
          encryptedBackupCodes: encryptedCodesStr,
          extraInstructions,
        },
      });

      // Create Binds
      if (data.binds && data.binds.length > 0) {
        await tx.gameAccountBind.createMany({
          data: data.binds.map((b) => ({
            gameAccountId: account.id,
            bindProvider: b.bindProvider,
            bindStatus: b.bindStatus,
            note: b.note,
          })),
        });
      }

      // Create Images
      if (data.images && data.images.length > 0) {
        await tx.accountImage.createMany({
          data: data.images.map((img, idx) => ({
            gameAccountId: account.id,
            imageUrl: img.imageUrl,
            isPrimary: img.isPrimary !== undefined ? img.isPrimary : idx === 0,
          })),
        });
      }

      // Security Audit Log
      await tx.securityAuditLog.create({
        data: {
          userId: sellerIdBigInt,
          action: 'ACCOUNT_LISTED',
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
          metadata: JSON.stringify({
            accountId: account.id.toString(),
            gameId: data.gameId,
            price: data.price,
            isPlatformOwned,
          }),
        },
      });

      return account;
    });

    return this.getListingById(listing.id.toString());
  }

  /**
   * Search & browse public listings with filters, sorting, and pagination
   */
  async getPublicListings(filters: QueryAccountFilters) {
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(filters.limit) || 20));
    const skip = (page - 1) * limit;

    // 1. Auto-release expired reservations and cancel associated pending orders
    await orderService.releaseExpiredReservations();

    // 2. Build Prisma where clause
    const where: Prisma.GameAccountWhereInput = {
      status: 'available',
    };

    if (filters.gameId) {
      where.gameId = BigInt(filters.gameId);
    }

    if (filters.platform) {
      where.game = {
        platform: { equals: filters.platform, mode: 'insensitive' },
      };
    }

    if (filters.serverRegion) {
      where.serverRegion = { equals: filters.serverRegion, mode: 'insensitive' };
    }

    if (filters.rankLevel) {
      where.rankLevel = { contains: filters.rankLevel, mode: 'insensitive' };
    }

    if (filters.deliveryType) {
      where.deliveryType = filters.deliveryType;
    }

    if (filters.isPlatformOwned !== undefined) {
      where.isPlatformOwned = filters.isPlatformOwned;
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) {
        where.price.gte = new Prisma.Decimal(filters.minPrice);
      }
      if (filters.maxPrice !== undefined) {
        where.price.lte = new Prisma.Decimal(filters.maxPrice);
      }
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    // 3. Sorting
    let orderBy: Prisma.GameAccountOrderByWithRelationInput = { createdAt: 'desc' };
    if (filters.sort === 'oldest') orderBy = { createdAt: 'asc' };
    if (filters.sort === 'price_asc') orderBy = { price: 'asc' };
    if (filters.sort === 'price_desc') orderBy = { price: 'desc' };
    if (filters.sort === 'popular') orderBy = { viewCount: 'desc' };

    // 4. Query total count and data in parallel
    const [total, accounts] = await Promise.all([
      prisma.gameAccount.count({ where }),
      prisma.gameAccount.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          game: {
            select: {
              id: true,
              title: true,
              platform: true,
              iconUrl: true,
            },
          },
          images: {
            select: {
              id: true,
              imageUrl: true,
              isPrimary: true,
            },
            orderBy: { isPrimary: 'desc' },
          },
          binds: {
            select: {
              bindProvider: true,
              bindStatus: true,
              note: true,
            },
          },
          seller: {
            select: {
              id: true,
              username: true,
              role: true,
              isEmailVerified: true,
              createdAt: true,
            },
          },
        },
      }),
    ]);

    const formattedAccounts = accounts.map((acc) => ({
      id: acc.id.toString(),
      title: acc.title,
      description: acc.description,
      price: Number(acc.price),
      serverRegion: acc.serverRegion,
      rankLevel: acc.rankLevel,
      deliveryType: acc.deliveryType,
      isPlatformOwned: acc.isPlatformOwned,
      status: acc.status,
      viewCount: acc.viewCount,
      createdAt: acc.createdAt,
      game: {
        id: acc.game.id.toString(),
        title: acc.game.title,
        platform: acc.game.platform,
        iconUrl: acc.game.iconUrl,
      },
      images: acc.images.map((img) => ({
        id: img.id.toString(),
        imageUrl: img.imageUrl,
        isPrimary: img.isPrimary,
      })),
      primaryImage: acc.images.find((img) => img.isPrimary)?.imageUrl || acc.images[0]?.imageUrl || null,
      binds: acc.binds,
      seller: {
        id: acc.seller.id.toString(),
        username: acc.seller.username,
        role: acc.seller.role,
        isEmailVerified: acc.seller.isEmailVerified,
        memberSince: acc.seller.createdAt,
      },
    }));

    return {
      accounts: formattedAccounts,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get single listing details with full binds and image gallery
   */
  async getListingById(id: string, viewerUserId?: string) {
    const accountId = BigInt(id);

    const account = await prisma.gameAccount.findUnique({
      where: { id: accountId },
      include: {
        game: {
          select: {
            id: true,
            title: true,
            platform: true,
            iconUrl: true,
          },
        },
        images: {
          select: {
            id: true,
            imageUrl: true,
            isPrimary: true,
          },
          orderBy: { isPrimary: 'desc' },
        },
        binds: {
          select: {
            id: true,
            bindProvider: true,
            bindStatus: true,
            note: true,
          },
        },
        seller: {
          select: {
            id: true,
            username: true,
            role: true,
            isEmailVerified: true,
            createdAt: true,
            _count: {
              select: {
                sellerOrders: { where: { status: 'completed' } },
              },
            },
          },
        },
      },
    });

    if (!account) {
      throw new NotFoundError(`Listing with ID ${id} not found`);
    }

    // Increment view count asynchronously
    prisma.gameAccount
      .update({
        where: { id: accountId },
        data: { viewCount: { increment: 1 } },
      })
      .catch(() => {});

    return {
      id: account.id.toString(),
      title: account.title,
      description: account.description,
      price: Number(account.price),
      serverRegion: account.serverRegion,
      rankLevel: account.rankLevel,
      deliveryType: account.deliveryType,
      isPlatformOwned: account.isPlatformOwned,
      status: account.status,
      viewCount: account.viewCount + 1,
      reservedUntil: account.reservedUntil,
      createdAt: account.createdAt,
      game: {
        id: account.game.id.toString(),
        title: account.game.title,
        platform: account.game.platform,
        iconUrl: account.game.iconUrl,
      },
      images: account.images.map((img) => ({
        id: img.id.toString(),
        imageUrl: img.imageUrl,
        isPrimary: img.isPrimary,
      })),
      binds: account.binds.map((b) => ({
        id: b.id.toString(),
        bindProvider: b.bindProvider,
        bindStatus: b.bindStatus,
        note: b.note,
      })),
      seller: {
        id: account.seller.id.toString(),
        username: account.seller.username,
        role: account.seller.role,
        isEmailVerified: account.seller.isEmailVerified,
        memberSince: account.seller.createdAt,
        successfulSalesCount: account.seller._count.sellerOrders,
      },
      isOwner: viewerUserId ? viewerUserId === account.seller.id.toString() : false,
    };
  }

  /**
   * Get listings created by current seller
   */
  async getMyListings(sellerId: string, status?: string, page: number = 1, limit: number = 20) {
    const sellerIdBigInt = BigInt(sellerId);
    const skip = (page - 1) * limit;

    const where: Prisma.GameAccountWhereInput = {
      sellerId: sellerIdBigInt,
      ...(status ? { status } : {}),
    };

    const [total, accounts] = await Promise.all([
      prisma.gameAccount.count({ where }),
      prisma.gameAccount.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          game: { select: { title: true, iconUrl: true } },
          images: { where: { isPrimary: true }, take: 1 },
          order: { select: { orderNumber: true, status: true } },
        },
      }),
    ]);

    return {
      accounts: accounts.map((acc) => ({
        id: acc.id.toString(),
        title: acc.title,
        price: Number(acc.price),
        serverRegion: acc.serverRegion,
        rankLevel: acc.rankLevel,
        deliveryType: acc.deliveryType,
        status: acc.status,
        viewCount: acc.viewCount,
        gameTitle: acc.game.title,
        primaryImage: acc.images[0]?.imageUrl || null,
        activeOrderNumber: acc.order?.orderNumber || null,
        createdAt: acc.createdAt,
      })),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update listing details
   */
  async updateListing(id: string, sellerId: string, userRole: string, data: UpdateAccountDTO) {
    const accountId = BigInt(id);

    const existing = await prisma.gameAccount.findUnique({
      where: { id: accountId },
    });

    if (!existing) {
      throw new NotFoundError(`Listing with ID ${id} not found`);
    }

    // Ownership check
    if (existing.sellerId.toString() !== sellerId && userRole !== 'admin') {
      throw new ForbiddenError('You do not have permission to edit this listing');
    }

    // Cannot edit if reserved or sold
    if (existing.status !== 'available') {
      throw new BadRequestError(`Cannot edit listing while its status is "${existing.status}"`);
    }

    await prisma.gameAccount.update({
      where: { id: accountId },
      data: {
        title: data.title,
        description: data.description,
        price: data.price ? new Prisma.Decimal(data.price) : undefined,
        serverRegion: data.serverRegion,
        rankLevel: data.rankLevel,
        deliveryType: data.deliveryType,
      },
    });

    return this.getListingById(id, sellerId);
  }

  /**
   * Delete or suspend listing
   */
  async deleteListing(id: string, sellerId: string, userRole: string) {
    const accountId = BigInt(id);

    const existing = await prisma.gameAccount.findUnique({
      where: { id: accountId },
      include: { order: true },
    });

    if (!existing) {
      throw new NotFoundError(`Listing with ID ${id} not found`);
    }

    if (existing.sellerId.toString() !== sellerId && userRole !== 'admin') {
      throw new ForbiddenError('You do not have permission to delete this listing');
    }

    if (existing.status !== 'available') {
      throw new BadRequestError(`Cannot delete listing while its status is "${existing.status}"`);
    }

    if (existing.order) {
      if (['paid', 'in_escrow', 'completed', 'in_dispute'].includes(existing.order.status)) {
        throw new BadRequestError(
          `Cannot delete listing with an active or completed order (status: "${existing.order.status}")`
        );
      }
    }

    await prisma.$transaction(async (tx) => {
      if (existing.order) {
        // Clean up cancelled order and dependent relations
        await tx.accountWarranty.deleteMany({ where: { orderId: existing.order.id } });
        await tx.payment.deleteMany({ where: { orderId: existing.order.id } });
        await tx.couponRedemption.deleteMany({ where: { orderId: existing.order.id } });
        await tx.order.delete({ where: { id: existing.order.id } });
      }

      await tx.gameAccount.delete({
        where: { id: accountId },
      });
    });

    return { message: 'Listing deleted successfully' };
  }
}

export const accountService = new AccountService();
export default accountService;
