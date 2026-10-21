import crypto from 'crypto';
import { prisma } from '../../../config/database';
import { config } from '../../../config';
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from '../../../common/errors/AppError';
import { decryptAES, decryptVaultField } from '../../../common/utils/crypto';
import { Prisma } from '@prisma/client';

export interface CheckoutDTO {
  gameAccountId: string;
  couponCode?: string;
  warrantyType?: string; // 24h, 7d, 30d, lifetime
  ipAddress?: string;
  userAgent?: string;
}

export class OrderService {
  /**
   * Helper: Generate human-friendly unique order number: e.g. ORD-20261021-9X2F
   */
  private generateOrderNumber(): string {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `ORD-${dateStr}-${randomHex}`;
  }

  /**
   * Checkout & 15-Minute Concurrency Reservation Lock
   */
  async checkout(buyerId: string, data: CheckoutDTO) {
    const buyerIdBigInt = BigInt(buyerId);
    const accountIdBigInt = BigInt(data.gameAccountId);

    // 1. Auto-release expired reservations globally before checking
    await prisma.gameAccount.updateMany({
      where: {
        status: 'reserved',
        reservedUntil: { lt: new Date() },
      },
      data: {
        status: 'available',
        reservedUntil: null,
      },
    });

    // 2. Execute Atomic Concurrency Reservation & Order Creation Transaction
    const result = await prisma.$transaction(async (tx) => {
      // Find account with all listing details
      const account = await tx.gameAccount.findUnique({
        where: { id: accountIdBigInt },
        include: {
          binds: true,
          images: true,
          game: true,
        },
      });

      if (!account) {
        throw new NotFoundError('Game account listing not found');
      }

      // Check self-purchase prevention
      if (account.sellerId === buyerIdBigInt) {
        throw new BadRequestError('You cannot purchase your own game account listing');
      }

      // Check availability (Concurrency Guard)
      if (account.status !== 'available') {
        throw new ConflictError(
          `This account is currently ${account.status}. It is either in checkout by another customer or already sold.`
        );
      }

      // 15-Minute Reservation window
      const reservationDurationMs = config.platform.reservationTimeoutMinutes * 60 * 1000;
      const reservedUntil = new Date(Date.now() + reservationDurationMs);

      // Lock account with status = 'reserved'
      await tx.gameAccount.update({
        where: { id: account.id },
        data: {
          status: 'reserved',
          reservedUntil,
        },
      });

      // 3. Coupon Calculation (if coupon code provided)
      let discountAmount = 0;
      let appliedCoupon: { id: bigint; code: string } | null = null;

      if (data.couponCode) {
        const coupon = await tx.coupon.findUnique({
          where: { code: data.couponCode.toUpperCase() },
        });

        const now = new Date();
        if (
          coupon &&
          coupon.isActive &&
          coupon.validFrom <= now &&
          coupon.validUntil >= now &&
          (!coupon.usageLimit || coupon.usedCount < coupon.usageLimit)
        ) {
          const accountPrice = Number(account.price);
          const minOrder = Number(coupon.minOrderAmount || 0);

          if (accountPrice >= minOrder) {
            // Check per user redemptions
            const userRedemptions = await tx.couponRedemption.count({
              where: {
                couponId: coupon.id,
                userId: buyerIdBigInt,
              },
            });

            if (userRedemptions < coupon.perUserLimit) {
              if (coupon.discountType === 'fixed_amount') {
                discountAmount = Math.min(accountPrice, Number(coupon.discountValue));
              } else if (coupon.discountType === 'percentage') {
                const calculated = (accountPrice * Number(coupon.discountValue)) / 100;
                discountAmount = coupon.maxDiscountAmount
                  ? Math.min(calculated, Number(coupon.maxDiscountAmount))
                  : calculated;
              }
              discountAmount = Math.round(discountAmount * 100) / 100;
              appliedCoupon = { id: coupon.id, code: coupon.code };
            }
          }
        }
      }

      // 4. Financial Calculation
      const subtotalAmount = Number(account.price);
      const totalAmount = Math.max(0, subtotalAmount - discountAmount);
      // Platform takes 10% commission from subtotal
      const platformFee = Math.round(subtotalAmount * config.platform.commissionRate * 100) / 100;
      // Seller gets subtotal minus platform commission
      const sellerNetAmount = Math.round((subtotalAmount - platformFee) * 100) / 100;

      // 5. Generate Immutable Listing Snapshot
      const listingSnapshot = JSON.stringify({
        accountId: account.id.toString(),
        game: {
          id: account.game.id.toString(),
          title: account.game.title,
          platform: account.game.platform,
        },
        title: account.title,
        description: account.description,
        price: subtotalAmount,
        serverRegion: account.serverRegion,
        rankLevel: account.rankLevel,
        deliveryType: account.deliveryType,
        isPlatformOwned: account.isPlatformOwned,
        binds: account.binds.map((b) => ({
          bindProvider: b.bindProvider,
          bindStatus: b.bindStatus,
          note: b.note,
        })),
        images: account.images.map((img) => img.imageUrl),
        purchasedAt: new Date().toISOString(),
      });

      // 6. Delete any existing cancelled orders for this account (to satisfy unique constraint)
      await tx.order.deleteMany({
        where: {
          gameAccountId: account.id,
          status: 'cancelled',
        },
      });

      // 7. Create Order
      let orderNumber = this.generateOrderNumber();
      while (await tx.order.findUnique({ where: { orderNumber } })) {
        orderNumber = this.generateOrderNumber();
      }

      const order = await tx.order.create({
        data: {
          orderNumber,
          buyerId: buyerIdBigInt,
          sellerId: account.sellerId,
          gameAccountId: account.id,
          subtotalAmount: new Prisma.Decimal(subtotalAmount),
          discountAmount: new Prisma.Decimal(discountAmount),
          totalAmount: new Prisma.Decimal(totalAmount),
          platformFee: new Prisma.Decimal(platformFee),
          sellerNetAmount: new Prisma.Decimal(sellerNetAmount),
          listingSnapshot,
          status: 'pending',
        },
      });

      // 7. Create Warranty Record
      const warrantyType = data.warrantyType || '24h';
      await tx.accountWarranty.create({
        data: {
          orderId: order.id,
          warrantyType,
          warrantyFee: new Prisma.Decimal(0),
          status: 'active',
        },
      });

      // 8. Record Coupon Redemption
      if (appliedCoupon && discountAmount > 0) {
        await tx.couponRedemption.create({
          data: {
            couponId: appliedCoupon.id,
            orderId: order.id,
            userId: buyerIdBigInt,
            discountAmount: new Prisma.Decimal(discountAmount),
          },
        });

        await tx.coupon.update({
          where: { id: appliedCoupon.id },
          data: { usedCount: { increment: 1 } },
        });
      }

      // 9. Security Audit Log
      await tx.securityAuditLog.create({
        data: {
          userId: buyerIdBigInt,
          action: 'ORDER_CREATED',
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
          metadata: JSON.stringify({
            orderNumber,
            totalAmount,
            gameAccountId: account.id.toString(),
            reservedUntil: reservedUntil.toISOString(),
          }),
        },
      });

      return {
        order,
        reservedUntil,
      };
    });

    return {
      orderNumber: result.order.orderNumber,
      status: result.order.status,
      financials: {
        subtotalAmount: Number(result.order.subtotalAmount),
        discountAmount: Number(result.order.discountAmount),
        totalAmount: Number(result.order.totalAmount),
        currency: 'USD',
      },
      reservation: {
        reservedUntil: result.reservedUntil,
        expiresInSeconds: Math.floor((result.reservedUntil.getTime() - Date.now()) / 1000),
      },
      createdAt: result.order.createdAt,
    };
  }

  /**
   * Get single order details with Vault Decryption for Buyer when Paid/Escrow/Completed
   */
  async getOrderDetails(orderNumber: string, userId: string, userRole: string) {
    const userIdBigInt = BigInt(userId);

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        gameAccount: {
          include: {
            game: true,
            images: true,
            credentials: true,
          },
        },
        warranty: true,
        payment: true,
        dispute: true,
        buyer: { select: { id: true, username: true, email: true } },
        seller: { select: { id: true, username: true, email: true } },
      },
    });

    if (!order) {
      throw new NotFoundError(`Order ${orderNumber} not found`);
    }

    const isBuyer = order.buyerId === userIdBigInt;
    const isSeller = order.sellerId === userIdBigInt;
    const isAdmin = userRole === 'admin';

    // Access control
    if (!isBuyer && !isSeller && !isAdmin) {
      throw new ForbiddenError('You do not have permission to view this order');
    }

    // Parse snapshot
    let snapshot = null;
    if (order.listingSnapshot) {
      try {
        snapshot = JSON.parse(order.listingSnapshot);
      } catch {
        snapshot = null;
      }
    }

    // Zero-Knowledge Credential Vault Decryption
    // Only revealed to buyer/admin AND only when status is paid, in_escrow, or completed
    let decryptedCredentials = null;
    const isRevealedStatus = ['paid', 'in_escrow', 'completed'].includes(order.status);

    if ((isBuyer || isAdmin) && isRevealedStatus && order.gameAccount.credentials) {
      const creds = order.gameAccount.credentials;
      try {
        const loginIdentifier = decryptVaultField(
          creds.encryptedLoginIdentifier,
          creds.initializationVector,
          creds.authTag
        );
        const loginPassword = decryptVaultField(
          creds.encryptedLoginPassword,
          creds.initializationVector,
          creds.authTag
        );
        const backupCodes = creds.encryptedBackupCodes
          ? decryptVaultField(creds.encryptedBackupCodes, creds.initializationVector, creds.authTag)
          : null;

        decryptedCredentials = {
          loginIdentifier,
          loginPassword,
          backupCodes,
          extraInstructions: creds.extraInstructions,
          revealedAt: creds.revealedAt || new Date(),
        };

        // Mark revealedAt timestamp if first time
        if (!creds.revealedAt) {
          prisma.accountCredential
            .update({
              where: { id: creds.id },
              data: { revealedAt: new Date() },
            })
            .catch(() => {});
        }
      } catch (err) {
        console.error('Failed to decrypt vault credentials:', err);
      }
    }

    return {
      orderNumber: order.orderNumber,
      status: order.status,
      financials: {
        subtotalAmount: Number(order.subtotalAmount),
        discountAmount: Number(order.discountAmount),
        totalAmount: Number(order.totalAmount),
        platformFee: isBuyer ? undefined : Number(order.platformFee), // hidden from buyer
        sellerNetAmount: isBuyer ? undefined : Number(order.sellerNetAmount),
        currency: 'USD',
      },
      buyer: {
        id: order.buyer.id.toString(),
        username: order.buyer.username,
      },
      seller: {
        id: order.seller.id.toString(),
        username: order.seller.username,
      },
      warranty: order.warranty
        ? {
            warrantyType: order.warranty.warrantyType,
            status: order.warranty.status,
            startDate: order.warranty.startDate,
            endDate: order.warranty.endDate,
          }
        : null,
      payment: order.payment
        ? {
            transactionId: order.payment.transactionId,
            paymentMethod: order.payment.paymentMethod,
            amount: Number(order.payment.amount),
            status: order.payment.status,
            paidAt: order.payment.paidAt,
          }
        : null,
      snapshot,
      credentials: decryptedCredentials, // null if unpaid or if viewer is seller
      createdAt: order.createdAt,
    };
  }

  /**
   * Cancel pending order (Releases 15-min reservation lock back to available)
   */
  async cancelOrder(orderNumber: string, userId: string, userRole: string) {
    const userIdBigInt = BigInt(userId);

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { couponRedemption: true },
    });

    if (!order) {
      throw new NotFoundError(`Order ${orderNumber} not found`);
    }

    if (order.buyerId !== userIdBigInt && userRole !== 'admin') {
      throw new ForbiddenError('Only the buyer or admin can cancel this order');
    }

    if (order.status !== 'pending') {
      throw new BadRequestError(`Cannot cancel an order with status "${order.status}"`);
    }

    await prisma.$transaction(async (tx) => {
      // 1. Mark order cancelled
      await tx.order.update({
        where: { id: order.id },
        data: { status: 'cancelled' },
      });

      // 2. Release game account back to available
      await tx.gameAccount.update({
        where: { id: order.gameAccountId },
        data: {
          status: 'available',
          reservedUntil: null,
        },
      });

      // 3. Rollback coupon if any
      if (order.couponRedemption) {
        await tx.coupon.update({
          where: { id: order.couponRedemption.couponId },
          data: { usedCount: { decrement: 1 } },
        });
        await tx.couponRedemption.delete({
          where: { id: order.couponRedemption.id },
        });
      }

      // 4. Audit Log
      await tx.securityAuditLog.create({
        data: {
          userId: userIdBigInt,
          action: 'ORDER_CANCELLED',
          metadata: JSON.stringify({ orderNumber }),
        },
      });
    });

    return { message: `Order ${orderNumber} has been cancelled and account returned to marketplace.` };
  }

  /**
   * Buyer confirms account handover -> Releases escrow funds to seller wallet
   */
  async confirmReceived(orderNumber: string, buyerId: string) {
    const buyerIdBigInt = BigInt(buyerId);

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        seller: {
          include: { wallet: true },
        },
        gameAccount: true,
      },
    });

    if (!order) {
      throw new NotFoundError(`Order ${orderNumber} not found`);
    }

    if (order.buyerId !== buyerIdBigInt) {
      throw new ForbiddenError('Only the buyer of this order can confirm account receipt');
    }

    if (!['paid', 'in_escrow'].includes(order.status)) {
      throw new BadRequestError(
        `Cannot confirm receipt for order with status "${order.status}". Order must be paid or in escrow.`
      );
    }

    const sellerWallet = order.seller.wallet;
    if (!sellerWallet) {
      throw new BadRequestError('Seller does not have an active wallet');
    }

    const netAmount = Number(order.sellerNetAmount);

    await prisma.$transaction(async (tx) => {
      // 1. Mark Order Completed
      await tx.order.update({
        where: { id: order.id },
        data: { status: 'completed' },
      });

      // 2. Mark Account Sold
      await tx.gameAccount.update({
        where: { id: order.gameAccountId },
        data: { status: 'sold' },
      });

      // 3. Release Escrow Funds: Credit seller wallet
      const updatedWallet = await tx.wallet.update({
        where: { id: sellerWallet.id },
        data: { balance: { increment: new Prisma.Decimal(netAmount) } },
      });

      // 4. Create Ledger Transaction
      await tx.walletTransaction.create({
        data: {
          walletId: sellerWallet.id,
          orderId: order.id,
          transactionType: 'earning',
          amount: new Prisma.Decimal(netAmount),
          balanceAfter: updatedWallet.balance,
        },
      });

      // 5. Audit Log
      await tx.securityAuditLog.create({
        data: {
          userId: buyerIdBigInt,
          action: 'ORDER_COMPLETED',
          metadata: JSON.stringify({
            orderNumber,
            creditedAmount: netAmount,
            sellerId: order.sellerId.toString(),
          }),
        },
      });
    });

    return {
      message: 'Account handover confirmed successfully. Escrow funds released to seller wallet.',
      status: 'completed',
    };
  }

  /**
   * Get list of orders for authenticated user (buyer or seller)
   */
  async getUserOrders(
    userId: string,
    roleFilter: 'buyer' | 'seller' = 'buyer',
    statusFilter?: string,
    page: number = 1,
    limit: number = 20
  ) {
    const userIdBigInt = BigInt(userId);
    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = {
      ...(roleFilter === 'seller' ? { sellerId: userIdBigInt } : { buyerId: userIdBigInt }),
      ...(statusFilter ? { status: statusFilter } : {}),
    };

    const [total, orders] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          gameAccount: {
            select: {
              title: true,
              game: { select: { title: true, iconUrl: true } },
              images: { where: { isPrimary: true }, take: 1 },
            },
          },
          buyer: { select: { username: true } },
          seller: { select: { username: true } },
        },
      }),
    ]);

    return {
      orders: orders.map((o) => ({
        orderNumber: o.orderNumber,
        status: o.status,
        totalAmount: Number(o.totalAmount),
        sellerNetAmount: roleFilter === 'seller' ? Number(o.sellerNetAmount) : undefined,
        accountTitle: o.gameAccount.title,
        gameTitle: o.gameAccount.game.title,
        primaryImage: o.gameAccount.images[0]?.imageUrl || null,
        counterparty: roleFilter === 'seller' ? o.buyer.username : o.seller.username,
        createdAt: o.createdAt,
      })),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

export const orderService = new OrderService();
export default orderService;
