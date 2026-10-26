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
import { telegramService } from '../../notifications/services/telegram.service';
import { emitToOrderRoom } from '../../../common/socket/socketManager';
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
   * Auto-release expired reservations globally:
   * 1. Resets expired accounts back to 'available'
   * 2. Cancels unpaid pending orders
   * 3. Automatically rolls back any coupons attached to those expired orders
   */
  async releaseExpiredReservations(): Promise<number> {
    const expiredAccounts = await prisma.gameAccount.findMany({
      where: {
        status: 'reserved',
        reservedUntil: { lt: new Date() },
      },
      select: { id: true },
    });

    if (expiredAccounts.length === 0) return 0;

    const accountIds = expiredAccounts.map((a) => a.id);

    // Find all pending orders on these expired accounts
    const expiredOrders = await prisma.order.findMany({
      where: {
        gameAccountId: { in: accountIds },
        status: 'pending',
      },
      include: { couponRedemption: true },
    });

    await prisma.$transaction(async (tx) => {
      // Roll back coupons for expired pending orders
      for (const ord of expiredOrders) {
        if (ord.couponRedemption) {
          await tx.coupon.update({
            where: { id: ord.couponRedemption.couponId },
            data: { usedCount: { decrement: 1 } },
          });
          await tx.couponRedemption.delete({
            where: { id: ord.couponRedemption.id },
          });
        }
      }

      // Mark pending orders as cancelled
      await tx.order.updateMany({
        where: {
          gameAccountId: { in: accountIds },
          status: 'pending',
        },
        data: { status: 'cancelled' },
      });

      // Release game accounts back to available
      await tx.gameAccount.updateMany({
        where: { id: { in: accountIds } },
        data: {
          status: 'available',
          reservedUntil: null,
        },
      });
    });

    return accountIds.length;
  }

  /**
   * Checkout & 15-Minute Concurrency Reservation Lock
   */
  async checkout(buyerId: string, data: CheckoutDTO) {
    const buyerIdBigInt = BigInt(buyerId);
    const accountIdBigInt = BigInt(data.gameAccountId);

    // 1. Auto-release expired reservations globally before checking
    await this.releaseExpiredReservations();

    // 2. If the same buyer already has a valid pending order for this account, return it (Idempotent checkout)
    const existingBuyerOrder = await prisma.order.findFirst({
      where: {
        buyerId: buyerIdBigInt,
        gameAccountId: accountIdBigInt,
        status: 'pending',
      },
      include: {
        gameAccount: true,
      },
    });

    if (
      existingBuyerOrder &&
      existingBuyerOrder.gameAccount.reservedUntil &&
      existingBuyerOrder.gameAccount.reservedUntil > new Date()
    ) {
      return {
        orderNumber: existingBuyerOrder.orderNumber,
        status: existingBuyerOrder.status,
        financials: {
          subtotalAmount: Number(existingBuyerOrder.subtotalAmount),
          discountAmount: Number(existingBuyerOrder.discountAmount),
          totalAmount: Number(existingBuyerOrder.totalAmount),
          currency: 'USD',
        },
        reservation: {
          reservedUntil: existingBuyerOrder.gameAccount.reservedUntil,
          expiresInSeconds: Math.floor(
            (existingBuyerOrder.gameAccount.reservedUntil.getTime() - Date.now()) / 1000
          ),
        },
        createdAt: existingBuyerOrder.createdAt,
      };
    }

    // 3. Execute Atomic Concurrency Reservation & Order Creation Transaction
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

      // Atomic CAS lock: only reserve if status is still 'available'
      const lockResult = await tx.gameAccount.updateMany({
        where: {
          id: account.id,
          status: 'available',
        },
        data: {
          status: 'reserved',
          reservedUntil,
        },
      });

      if (lockResult.count === 0) {
        throw new ConflictError(
          'This account listing was just reserved or purchased by another customer. Please try again.'
        );
      }

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
              if (coupon.discountType === 'fixed' || coupon.discountType === 'fixed_amount') {
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
      let totalAmount = Math.max(0, subtotalAmount - discountAmount);
      let platformFee: number;
      let sellerNetAmount: number;

      if (account.isPlatformOwned) {
        // B2C Platform-Owned: 100% of revenue belongs to Platform Treasury
        platformFee = totalAmount;
        sellerNetAmount = 0;
      } else {
        // C2C Marketplace: Platform takes commission (default 10%)
        const maxCommission = Math.round(subtotalAmount * config.platform.commissionRate * 100) / 100;
        // Cap platform coupon discount to platform commission to prevent negative platform revenue
        const effectiveDiscount = Math.min(discountAmount, maxCommission);
        totalAmount = Math.max(0, subtotalAmount - effectiveDiscount);
        discountAmount = effectiveDiscount;
        platformFee = Math.max(0, Math.round((maxCommission - effectiveDiscount) * 100) / 100);
        sellerNetAmount = Math.round((subtotalAmount - maxCommission) * 100) / 100;
      }

      // If promotional coupon covers 100% (total = 0), transition immediately to in_escrow
      const isFreeOrder = totalAmount === 0;
      const initialOrderStatus = isFreeOrder ? 'in_escrow' : 'pending';

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

      // 6. Clean up previous inactive/cancelled orders on this account (to satisfy unique constraint)
      const oldOrders = await tx.order.findMany({
        where: {
          gameAccountId: account.id,
          status: { in: ['cancelled', 'pending'] },
        },
        select: { id: true },
      });

      if (oldOrders.length > 0) {
        const oldOrderIds = oldOrders.map((o) => o.id);
        await tx.accountWarranty.deleteMany({ where: { orderId: { in: oldOrderIds } } });
        await tx.payment.deleteMany({ where: { orderId: { in: oldOrderIds } } });
        await tx.couponRedemption.deleteMany({ where: { orderId: { in: oldOrderIds } } });
        await tx.order.deleteMany({ where: { id: { in: oldOrderIds } } });
      }

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
          status: initialOrderStatus,
        },
      });

      // If free order, record automated payment and lock account into escrow immediately
      if (isFreeOrder) {
        await tx.payment.create({
          data: {
            orderId: order.id,
            transactionId: `TXN-FREE-${Date.now()}`,
            paymentMethod: 'coupon_free',
            amount: new Prisma.Decimal(0),
            status: 'paid',
            paidAt: new Date(),
          },
        });

        await tx.gameAccount.update({
          where: { id: account.id },
          data: {
            status: 'in_escrow',
            reservedUntil: null,
          },
        });
      }

      // 8. Create Warranty Record
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
      // 1. Mark order cancelled (atomic guard: only cancel if still pending)
      const cancelResult = await tx.order.updateMany({
        where: {
          id: order.id,
          status: 'pending',
        },
        data: { status: 'cancelled' },
      });

      if (cancelResult.count === 0) {
        throw new BadRequestError('Order is not in pending status or was already processed.');
      }

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

    // Real-time WebSocket emission to order room
    emitToOrderRoom(orderNumber, 'order_cancelled', {
      orderNumber,
      status: 'cancelled',
      message: `Order ${orderNumber} was cancelled and account returned to marketplace.`,
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
      // 1. Mark Order Completed (atomic guard: only complete if still in_escrow or paid)
      const completeResult = await tx.order.updateMany({
        where: {
          id: order.id,
          status: { in: ['paid', 'in_escrow'] },
        },
        data: { status: 'completed' },
      });

      if (completeResult.count === 0) {
        throw new BadRequestError('Order was already confirmed or is not in a valid escrow state.');
      }

      // 2. Mark Account Sold
      await tx.gameAccount.update({
        where: { id: order.gameAccountId },
        data: { status: 'sold' },
      });

      // 3. Release Escrow Funds
      if (order.gameAccount.isPlatformOwned) {
        // B2C Platform-Owned: 100% of revenue belongs to Platform Treasury
        await tx.securityAuditLog.create({
          data: {
            userId: buyerIdBigInt,
            action: 'B2C_REVENUE_CONFIRMED',
            metadata: JSON.stringify({
              orderNumber,
              platformRevenue: Number(order.totalAmount),
              platformFee: Number(order.platformFee),
            }),
          },
        });
      } else if (netAmount > 0) {
        // C2C Marketplace: Credit seller wallet
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
      }

      // 5. Automatic Referral Reward on referee's first completed trade
      const pendingReferral = await tx.userReferral.findFirst({
        where: {
          refereeId: buyerIdBigInt,
          status: 'pending',
        },
        include: {
          referrer: { include: { wallet: true } },
        },
      });

      if (pendingReferral && pendingReferral.referrer.wallet) {
        // Platform referral reward: 2% of order total (minimum $0.50)
        const rewardAmount = Math.max(0.5, Number((Number(order.totalAmount) * 0.02).toFixed(2)));

        // Update referral status to completed
        await tx.userReferral.update({
          where: { id: pendingReferral.id },
          data: { status: 'completed' },
        });

        // Record reward
        await tx.referralReward.create({
          data: {
            referralId: pendingReferral.id,
            referrerId: pendingReferral.referrerId,
            orderId: order.id,
            rewardAmount: new Prisma.Decimal(rewardAmount),
            status: 'credited',
          },
        });

        // Credit referrer wallet
        const updatedReferrerWallet = await tx.wallet.update({
          where: { id: pendingReferral.referrer.wallet.id },
          data: {
            balance: { increment: new Prisma.Decimal(rewardAmount) },
          },
        });

        // Ledger record for referrer
        await tx.walletTransaction.create({
          data: {
            walletId: pendingReferral.referrer.wallet.id,
            orderId: order.id,
            transactionType: 'referral_reward',
            amount: new Prisma.Decimal(rewardAmount),
            balanceAfter: updatedReferrerWallet.balance,
          },
        });
      }

      // 6. Audit Log
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

    // Notify seller via Telegram asynchronously
    telegramService.notifyUser(
      order.sellerId,
      'payout',
      `🎉 <b>Account Handover Confirmed!</b>\nOrder <code>#${orderNumber}</code> is completed. $${netAmount.toFixed(2)} has been credited to your wallet balance.`
    );

    // Real-time WebSocket emission to order room
    emitToOrderRoom(orderNumber, 'order_completed', {
      orderNumber,
      status: 'completed',
      message: 'Account handover confirmed. Escrow funds released to seller.',
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

  /**
   * Auto-release Escrow funds for orders in 'in_escrow' or 'paid' whose inspection window
   * (e.g. 24 or 48 hours) has expired without an active dispute.
   * Credits the seller wallet and finalizes the order safely.
   */
  async autoReleaseEscrow(inspectionHours = 24): Promise<number> {
    const thresholdDate = new Date(Date.now() - inspectionHours * 3600 * 1000);

    const eligibleOrders = await prisma.order.findMany({
      where: {
        status: { in: ['paid', 'in_escrow'] },
        dispute: null, // No dispute filed
        createdAt: { lt: thresholdDate },
      },
      include: {
        seller: { include: { wallet: true } },
        gameAccount: true,
      },
    });

    if (eligibleOrders.length === 0) return 0;

    let releasedCount = 0;

    for (const order of eligibleOrders) {
      try {
        const netAmount = Number(order.sellerNetAmount);
        const sellerWallet = order.seller.wallet;

        await prisma.$transaction(async (tx) => {
          // 1. Mark Order Completed
          const completeResult = await tx.order.updateMany({
            where: {
              id: order.id,
              status: { in: ['paid', 'in_escrow'] },
            },
            data: { status: 'completed' },
          });

          if (completeResult.count === 0) return;

          // 2. Mark Account Sold
          await tx.gameAccount.update({
            where: { id: order.gameAccountId },
            data: { status: 'sold' },
          });

          // 3. Release Funds to seller wallet
          if (sellerWallet && netAmount > 0 && !order.gameAccount.isPlatformOwned) {
            const updatedWallet = await tx.wallet.update({
              where: { id: sellerWallet.id },
              data: { balance: { increment: new Prisma.Decimal(netAmount) } },
            });

            await tx.walletTransaction.create({
              data: {
                walletId: sellerWallet.id,
                orderId: order.id,
                transactionType: 'earning',
                amount: new Prisma.Decimal(netAmount),
                balanceAfter: updatedWallet.balance,
              },
            });
          }

          // 4. Audit Log
          await tx.securityAuditLog.create({
            data: {
              userId: null,
              action: 'ESCROW_AUTO_RELEASED',
              metadata: JSON.stringify({
                orderNumber: order.orderNumber,
                creditedAmount: netAmount,
                sellerId: order.sellerId.toString(),
                inspectionHours,
              }),
            },
          });
        });

        // Notifications
        telegramService.notifyUser(
          order.sellerId,
          'payout',
          `🎉 <b>Escrow Auto-Released!</b>\nInspection period (${inspectionHours}h) expired with no disputes for Order <code>#${order.orderNumber}</code>. $${netAmount.toFixed(2)} has been credited to your wallet.`
        );

        emitToOrderRoom(order.orderNumber, 'order_completed', {
          orderNumber: order.orderNumber,
          status: 'completed',
          message: `Escrow auto-released after ${inspectionHours}h inspection window.`,
        });

        releasedCount++;
      } catch (err) {
        console.error(`Failed to auto-release escrow for order ${order.orderNumber}:`, err);
      }
    }

    return releasedCount;
  }
}

export const orderService = new OrderService();
export default orderService;
