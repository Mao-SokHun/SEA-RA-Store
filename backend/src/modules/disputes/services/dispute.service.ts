import { prisma } from '../../../config/database';
import {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  ConflictError,
} from '../../../common/errors/AppError';
import { Prisma } from '@prisma/client';
import { chatService } from '../../chat/services/chat.service';
import { emitToOrderRoom } from '../../../common/socket/socketManager';

export interface CreateDisputeDTO {
  reason: string;
  description: string;
}

export interface ResolveDisputeDTO {
  resolution: 'refund_buyer' | 'payout_seller' | 'dismiss';
  adminNotes: string;
}

export class DisputeService {
  /**
   * Open a dispute on an order
   */
  async createDispute(
    orderNumber: string,
    userId: string,
    userRole: string,
    data: CreateDisputeDTO
  ) {
    const userIdBigInt = BigInt(userId);

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        dispute: true,
        buyer: { select: { id: true, username: true } },
        seller: { select: { id: true, username: true } },
      },
    });

    if (!order) {
      throw new NotFoundError(`Order with number "${orderNumber}" not found`);
    }

    const isBuyer = order.buyerId === userIdBigInt;
    const isSeller = order.sellerId === userIdBigInt;
    const isAdmin = userRole === 'admin';

    if (!isBuyer && !isSeller && !isAdmin) {
      throw new ForbiddenError('Only the buyer or seller can open a dispute for this order');
    }

    if (order.dispute) {
      throw new ConflictError(
        `A dispute already exists for this order with status: "${order.dispute.status}"`
      );
    }

    // Allowed order statuses to dispute
    const validDisputeStatuses = ['paid', 'in_escrow', 'completed'];
    if (!validDisputeStatuses.includes(order.status)) {
      throw new BadRequestError(
        `Cannot dispute order with status "${order.status}". Allowed statuses: ${validDisputeStatuses.join(', ')}`
      );
    }

    // Atomic dispute creation & order status freeze
    const dispute = await prisma.$transaction(async (tx) => {
      // 1. Freeze order status
      await tx.order.update({
        where: { id: order.id },
        data: { status: 'in_dispute' },
      });

      // 2. Create dispute
      const newDispute = await tx.dispute.create({
        data: {
          orderId: order.id,
          raisedBy: userIdBigInt,
          reason: data.reason,
          description: data.description,
          status: 'open',
        },
        include: {
          raiser: {
            select: { id: true, username: true, role: true },
          },
        },
      });

      // 3. Security Audit Log
      await tx.securityAuditLog.create({
        data: {
          userId: userIdBigInt,
          action: 'DISPUTE_RAISED',
          metadata: JSON.stringify({
            orderNumber,
            reason: data.reason,
            disputeId: newDispute.id.toString(),
          }),
        },
      });

      return newDispute;
    });

    // Notify room via system message & socket event
    const raiserName = isBuyer ? order.buyer.username : order.seller.username;
    await chatService.sendSystemMessage(
      orderNumber,
      `⚠️ Dispute opened by @${raiserName}: "${data.reason}". Escrow is held while admin review is in progress.`
    );

    emitToOrderRoom(orderNumber, 'dispute_opened', {
      orderNumber,
      disputeId: dispute.id.toString(),
      raisedBy: raiserName,
      reason: data.reason,
    });

    return {
      message: 'Dispute opened successfully. Support will investigate within 24 hours.',
      dispute: {
        id: dispute.id.toString(),
        orderNumber,
        reason: dispute.reason,
        description: dispute.description,
        status: dispute.status,
        raisedBy: {
          id: dispute.raiser.id.toString(),
          username: dispute.raiser.username,
        },
        createdAt: dispute.createdAt,
      },
    };
  }

  /**
   * Get dispute details for an order
   */
  async getDispute(orderNumber: string, userId: string, userRole: string) {
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        dispute: {
          include: {
            raiser: {
              select: { id: true, username: true, email: true },
            },
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundError(`Order with number "${orderNumber}" not found`);
    }

    if (!order.dispute) {
      throw new NotFoundError(`No dispute found for order "${orderNumber}"`);
    }

    const userIdBigInt = BigInt(userId);
    const isBuyer = order.buyerId === userIdBigInt;
    const isSeller = order.sellerId === userIdBigInt;
    const isAdmin = userRole === 'admin';

    if (!isBuyer && !isSeller && !isAdmin) {
      throw new ForbiddenError('Unauthorized to view this dispute');
    }

    return {
      id: order.dispute.id.toString(),
      orderNumber,
      reason: order.dispute.reason,
      description: order.dispute.description,
      status: order.dispute.status,
      adminNotes: order.dispute.adminNotes,
      raisedBy: {
        id: order.dispute.raiser.id.toString(),
        username: order.dispute.raiser.username,
      },
      createdAt: order.dispute.createdAt,
    };
  }

  /**
   * Admin: List all disputes
   */
  async adminListDisputes(status?: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const where: Prisma.DisputeWhereInput = status ? { status } : {};

    const [total, disputes] = await Promise.all([
      prisma.dispute.count({ where }),
      prisma.dispute.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          order: {
            select: {
              orderNumber: true,
              totalAmount: true,
              status: true,
              buyer: { select: { id: true, username: true, email: true } },
              seller: { select: { id: true, username: true, email: true } },
              gameAccount: { select: { title: true } },
            },
          },
          raiser: { select: { id: true, username: true, email: true } },
        },
      }),
    ]);

    return {
      disputes: disputes.map((d) => ({
        id: d.id.toString(),
        orderNumber: d.order.orderNumber,
        accountTitle: d.order.gameAccount?.title || 'Unknown Account',
        totalAmount: Number(d.order.totalAmount),
        reason: d.reason,
        description: d.description,
        status: d.status,
        adminNotes: d.adminNotes,
        raisedBy: {
          id: d.raiser.id.toString(),
          username: d.raiser.username,
          email: d.raiser.email,
        },
        buyer: {
          id: d.order.buyer.id.toString(),
          username: d.order.buyer.username,
        },
        seller: {
          id: d.order.seller.id.toString(),
          username: d.order.seller.username,
        },
        createdAt: d.createdAt,
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
   * Admin: Resolve a dispute
   */
  async adminResolveDispute(
    orderNumber: string,
    data: ResolveDisputeDTO,
    adminId: string
  ) {
    const adminIdBigInt = BigInt(adminId);

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        dispute: true,
        buyer: { include: { wallet: true } },
        seller: { include: { wallet: true } },
      },
    });

    if (!order) {
      throw new NotFoundError(`Order with number "${orderNumber}" not found`);
    }

    if (!order.dispute) {
      throw new NotFoundError(`No dispute found for order "${orderNumber}"`);
    }

    if (order.dispute.status !== 'open' && order.dispute.status !== 'under_review') {
      throw new BadRequestError(`Dispute is already closed with status "${order.dispute.status}"`);
    }

    const { resolution, adminNotes } = data;

    await prisma.$transaction(async (tx) => {
      // Atomic guard: only resolve if dispute is currently open or under_review
      const targetDisputeStatus =
        resolution === 'refund_buyer'
          ? 'resolved_buyer'
          : resolution === 'payout_seller'
          ? 'resolved_seller'
          : 'dismissed';

      const disputeCount = await tx.dispute.updateMany({
        where: {
          id: order.dispute!.id,
          status: { in: ['open', 'under_review'] },
        },
        data: {
          status: targetDisputeStatus,
          adminNotes,
        },
      });

      if (disputeCount.count === 0) {
        throw new BadRequestError('Dispute was already resolved or is no longer open.');
      }

      // 1. REFUND BUYER
      if (resolution === 'refund_buyer') {
        const refundAmount = Number(order.totalAmount);
        const buyerWallet = order.buyer.wallet;

        if (buyerWallet) {
          // Increment buyer wallet
          const updatedWallet = await tx.wallet.update({
            where: { id: buyerWallet.id },
            data: {
              balance: { increment: new Prisma.Decimal(refundAmount) },
            },
          });

          // Ledger record
          await tx.walletTransaction.create({
            data: {
              walletId: buyerWallet.id,
              orderId: order.id,
              transactionType: 'refund',
              amount: new Prisma.Decimal(refundAmount),
              balanceAfter: updatedWallet.balance,
            },
          });
        }

        // Update Order status
        await tx.order.update({
          where: { id: order.id },
          data: { status: 'refunded' },
        });

        // Set Account available again
        await tx.gameAccount.update({
          where: { id: order.gameAccountId },
          data: { status: 'available' },
        });
      }
      // 2. PAYOUT SELLER
      else if (resolution === 'payout_seller') {
        const sellerPayout = Number(order.sellerNetAmount);
        const sellerWallet = order.seller.wallet;

        if (sellerWallet) {
          // Credit seller wallet
          const updatedWallet = await tx.wallet.update({
            where: { id: sellerWallet.id },
            data: {
              balance: { increment: new Prisma.Decimal(sellerPayout) },
            },
          });

          // Ledger record
          await tx.walletTransaction.create({
            data: {
              walletId: sellerWallet.id,
              orderId: order.id,
              transactionType: 'earning',
              amount: new Prisma.Decimal(sellerPayout),
              balanceAfter: updatedWallet.balance,
            },
          });
        }

        // Update Order status
        await tx.order.update({
          where: { id: order.id },
          data: { status: 'completed' },
        });

        // Set Account sold
        await tx.gameAccount.update({
          where: { id: order.gameAccountId },
          data: { status: 'sold' },
        });
      }
      // 3. DISMISS
      else if (resolution === 'dismiss') {
        // Return order status to in_escrow
        await tx.order.update({
          where: { id: order.id },
          data: { status: 'in_escrow' },
        });
      }

      // Security Audit Log
      await tx.securityAuditLog.create({
        data: {
          userId: adminIdBigInt,
          action: 'DISPUTE_RESOLVED',
          metadata: JSON.stringify({
            orderNumber,
            resolution,
            adminNotes,
          }),
        },
      });
    });

    // Notify room of resolution
    const resolutionText =
      resolution === 'refund_buyer'
        ? `Dispute resolved in favor of Buyer. Full refund of $${Number(order.totalAmount).toFixed(2)} issued.`
        : resolution === 'payout_seller'
        ? 'Dispute resolved in favor of Seller. Payout released to seller wallet.'
        : 'Dispute dismissed by admin. Escrow process resumed.';

    await chatService.sendSystemMessage(
      orderNumber,
      `⚖️ ${resolutionText} Note: "${adminNotes}"`
    );

    emitToOrderRoom(orderNumber, 'dispute_resolved', {
      orderNumber,
      resolution,
      adminNotes,
    });

    return {
      message: `Dispute on order ${orderNumber} resolved as "${resolution}".`,
      resolution,
    };
  }
}

export const disputeService = new DisputeService();
export default disputeService;
