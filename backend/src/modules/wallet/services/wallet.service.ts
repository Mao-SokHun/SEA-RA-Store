import { prisma } from '../../../config/database';
import {
  BadRequestError,
  NotFoundError,
} from '../../../common/errors/AppError';
import { Prisma } from '@prisma/client';

export interface RequestWithdrawalDTO {
  amount: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
  ipAddress?: string;
  userAgent?: string;
}

export class WalletService {
  /**
   * Get user wallet overview (balance, total earned, total withdrawn, pending payout)
   */
  async getWalletOverview(userId: string) {
    const userIdBigInt = BigInt(userId);

    const wallet = await prisma.wallet.findUnique({
      where: { userId: userIdBigInt },
    });

    if (!wallet) {
      throw new NotFoundError('Wallet not found');
    }

    // Aggregate statistics
    const [earningsAgg, pendingWithdrawalsAgg, completedWithdrawalsAgg, recentTransactions] =
      await Promise.all([
        // Total earnings
        prisma.walletTransaction.aggregate({
          where: {
            walletId: wallet.id,
            transactionType: 'earning',
          },
          _sum: { amount: true },
        }),
        // Pending withdrawals
        prisma.withdrawalRequest.aggregate({
          where: {
            userId: userIdBigInt,
            status: 'pending',
          },
          _sum: { amount: true },
        }),
        // Completed withdrawals
        prisma.withdrawalRequest.aggregate({
          where: {
            userId: userIdBigInt,
            status: 'approved',
          },
          _sum: { amount: true },
        }),
        // Recent 5 transactions
        prisma.walletTransaction.findMany({
          where: { walletId: wallet.id },
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            order: { select: { orderNumber: true } },
          },
        }),
      ]);

    return {
      balance: Number(wallet.balance),
      currency: 'USD',
      totalEarned: Number(earningsAgg._sum.amount || 0),
      totalWithdrawn: Number(completedWithdrawalsAgg._sum.amount || 0),
      pendingWithdrawalAmount: Number(pendingWithdrawalsAgg._sum.amount || 0),
      recentTransactions: recentTransactions.map((tx) => ({
        id: tx.id.toString(),
        transactionType: tx.transactionType,
        amount: Number(tx.amount),
        balanceAfter: Number(tx.balanceAfter),
        orderNumber: tx.order?.orderNumber || null,
        createdAt: tx.createdAt,
      })),
      updatedAt: wallet.updatedAt,
    };
  }

  /**
   * Get paginated ledger transactions
   */
  async getTransactions(
    userId: string,
    transactionType?: string,
    page: number = 1,
    limit: number = 20
  ) {
    const userIdBigInt = BigInt(userId);
    const skip = (page - 1) * limit;

    const wallet = await prisma.wallet.findUnique({
      where: { userId: userIdBigInt },
    });

    if (!wallet) {
      throw new NotFoundError('Wallet not found');
    }

    const where: Prisma.WalletTransactionWhereInput = {
      walletId: wallet.id,
      ...(transactionType ? { transactionType } : {}),
    };

    const [total, transactions] = await Promise.all([
      prisma.walletTransaction.count({ where }),
      prisma.walletTransaction.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          order: { select: { orderNumber: true } },
          withdrawalRequest: {
            select: {
              id: true,
              bankName: true,
              accountNumber: true,
              status: true,
            },
          },
        },
      }),
    ]);

    return {
      transactions: transactions.map((tx) => ({
        id: tx.id.toString(),
        transactionType: tx.transactionType,
        amount: Number(tx.amount),
        balanceAfter: Number(tx.balanceAfter),
        orderNumber: tx.order?.orderNumber || null,
        withdrawal: tx.withdrawalRequest
          ? {
              id: tx.withdrawalRequest.id.toString(),
              bankName: tx.withdrawalRequest.bankName,
              accountNumber: tx.withdrawalRequest.accountNumber,
              status: tx.withdrawalRequest.status,
            }
          : null,
        createdAt: tx.createdAt,
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
   * Request withdrawal to bank account (Seller payout)
   */
  async requestWithdrawal(userId: string, data: RequestWithdrawalDTO) {
    const userIdBigInt = BigInt(userId);
    const withdrawAmount = Number(data.amount);

    if (withdrawAmount <= 0) {
      throw new BadRequestError('Withdrawal amount must be greater than zero');
    }

    const wallet = await prisma.wallet.findUnique({
      where: { userId: userIdBigInt },
    });

    if (!wallet) {
      throw new NotFoundError('Wallet not found');
    }

    const currentBalance = Number(wallet.balance);
    if (currentBalance < withdrawAmount) {
      throw new BadRequestError(
        `Insufficient wallet balance. You have $${currentBalance.toFixed(2)}, cannot withdraw $${withdrawAmount.toFixed(2)}.`
      );
    }

    // Atomic withdrawal request & wallet balance deduction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Deduct held funds from wallet (Atomic CAS guard)
      const deductCount = await tx.wallet.updateMany({
        where: {
          id: wallet.id,
          balance: { gte: new Prisma.Decimal(withdrawAmount) },
        },
        data: {
          balance: { decrement: new Prisma.Decimal(withdrawAmount) },
        },
      });

      if (deductCount.count === 0) {
        throw new BadRequestError('Insufficient wallet balance or concurrent transaction in progress');
      }

      const updatedWallet = await tx.wallet.findUniqueOrThrow({
        where: { id: wallet.id },
      });

      // 2. Create withdrawal request
      const request = await tx.withdrawalRequest.create({
        data: {
          userId: userIdBigInt,
          amount: new Prisma.Decimal(withdrawAmount),
          bankName: data.bankName,
          accountNumber: data.accountNumber,
          accountName: data.accountName.toUpperCase(),
          status: 'pending',
        },
      });

      // 3. Create ledger transaction
      await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          withdrawalRequestId: request.id,
          transactionType: 'withdrawal',
          amount: new Prisma.Decimal(-withdrawAmount),
          balanceAfter: updatedWallet.balance,
        },
      });

      // 4. Audit Log
      await tx.securityAuditLog.create({
        data: {
          userId: userIdBigInt,
          action: 'WITHDRAWAL_REQUESTED',
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
          metadata: JSON.stringify({
            withdrawalId: request.id.toString(),
            amount: withdrawAmount,
            bankName: data.bankName,
            accountNumber: data.accountNumber,
          }),
        },
      });

      return {
        request,
        remainingBalance: Number(updatedWallet.balance),
      };
    });

    return {
      message: 'Withdrawal request submitted successfully. Processing time is typically 1-24 hours.',
      withdrawal: {
        id: result.request.id.toString(),
        amount: Number(result.request.amount),
        bankName: result.request.bankName,
        accountNumber: result.request.accountNumber,
        accountName: result.request.accountName,
        status: result.request.status,
        createdAt: result.request.createdAt,
      },
      remainingBalance: result.remainingBalance,
    };
  }

  /**
   * Get user's own withdrawal requests
   */
  async getMyWithdrawals(userId: string, page: number = 1, limit: number = 20) {
    const userIdBigInt = BigInt(userId);
    const skip = (page - 1) * limit;

    const [total, requests] = await Promise.all([
      prisma.withdrawalRequest.count({ where: { userId: userIdBigInt } }),
      prisma.withdrawalRequest.findMany({
        where: { userId: userIdBigInt },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      withdrawals: requests.map((r) => ({
        id: r.id.toString(),
        amount: Number(r.amount),
        bankName: r.bankName,
        accountNumber: r.accountNumber,
        accountName: r.accountName,
        status: r.status,
        adminNotes: r.adminNotes,
        createdAt: r.createdAt,
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
   * Admin: List all withdrawal requests
   */
  async adminGetWithdrawals(status?: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const where: Prisma.WithdrawalRequestWhereInput = status ? { status } : {};

    const [total, requests] = await Promise.all([
      prisma.withdrawalRequest.count({ where }),
      prisma.withdrawalRequest.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
              phone: true,
            },
          },
        },
      }),
    ]);

    return {
      withdrawals: requests.map((r) => ({
        id: r.id.toString(),
        amount: Number(r.amount),
        bankName: r.bankName,
        accountNumber: r.accountNumber,
        accountName: r.accountName,
        status: r.status,
        adminNotes: r.adminNotes,
        createdAt: r.createdAt,
        user: {
          id: r.user.id.toString(),
          username: r.user.username,
          email: r.user.email,
          phone: r.user.phone,
        },
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
   * Admin: Approve withdrawal request
   */
  async adminApproveWithdrawal(id: string, adminNotes?: string, adminId?: string) {
    const requestId = BigInt(id);

    const request = await prisma.withdrawalRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundError(`Withdrawal request with ID ${id} not found`);
    }

    if (request.status !== 'pending') {
      throw new BadRequestError(`Cannot approve request with status "${request.status}"`);
    }

    const updated = await prisma.withdrawalRequest.update({
      where: { id: requestId },
      data: {
        status: 'approved',
        adminNotes: adminNotes || 'Approved and bank transfer executed',
      },
    });

    if (adminId) {
      await prisma.securityAuditLog.create({
        data: {
          userId: BigInt(adminId),
          action: 'WITHDRAWAL_APPROVED',
          metadata: JSON.stringify({ withdrawalId: id, amount: Number(request.amount) }),
        },
      });
    }

    return {
      message: `Withdrawal request #${id} has been approved.`,
      status: updated.status,
    };
  }

  /**
   * Admin: Reject withdrawal request & refund funds back to user wallet
   */
  async adminRejectWithdrawal(id: string, reason: string, adminId?: string) {
    const requestId = BigInt(id);

    const request = await prisma.withdrawalRequest.findUnique({
      where: { id: requestId },
      include: {
        user: { include: { wallet: true } },
      },
    });

    if (!request) {
      throw new NotFoundError(`Withdrawal request with ID ${id} not found`);
    }

    if (request.status !== 'pending') {
      throw new BadRequestError(`Cannot reject request with status "${request.status}"`);
    }

    const userWallet = request.user.wallet;
    if (!userWallet) {
      throw new BadRequestError('User wallet not found to refund');
    }

    const refundAmount = Number(request.amount);

    await prisma.$transaction(async (tx) => {
      // 1. Mark request rejected
      await tx.withdrawalRequest.update({
        where: { id: requestId },
        data: {
          status: 'rejected',
          adminNotes: reason,
        },
      });

      // 2. Refund held balance back to user wallet
      const updatedWallet = await tx.wallet.update({
        where: { id: userWallet.id },
        data: {
          balance: { increment: new Prisma.Decimal(refundAmount) },
        },
      });

      // 3. Create reversal ledger transaction
      await tx.walletTransaction.create({
        data: {
          walletId: userWallet.id,
          withdrawalRequestId: request.id,
          transactionType: 'withdrawal_refund',
          amount: new Prisma.Decimal(refundAmount),
          balanceAfter: updatedWallet.balance,
        },
      });

      // 4. Audit Log
      if (adminId) {
        await tx.securityAuditLog.create({
          data: {
            userId: BigInt(adminId),
            action: 'WITHDRAWAL_REJECTED',
            metadata: JSON.stringify({
              withdrawalId: id,
              refundAmount,
              reason,
            }),
          },
        });
      }
    });

    return {
      message: `Withdrawal #${id} rejected and $${refundAmount} refunded back to user's wallet.`,
      status: 'rejected',
    };
  }

  /**
   * Top up wallet balance (Simulation / Instant Credit)
   */
  async topup(userId: string, amount: number) {
    const userIdBigInt = BigInt(userId);

    const wallet = await prisma.wallet.findUnique({
      where: { userId: userIdBigInt },
    });

    if (!wallet) {
      throw new NotFoundError('Wallet not found');
    }

    const updated = await prisma.$transaction(async (tx) => {
      const updatedWallet = await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: { increment: new Prisma.Decimal(amount) },
        },
      });

      await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          transactionType: 'earning', // credit
          amount: new Prisma.Decimal(amount),
          balanceAfter: updatedWallet.balance,
        },
      });

      return updatedWallet;
    });

    return {
      message: `Successfully topped up $${amount.toFixed(2)} to wallet.`,
      newBalance: Number(updated.balance),
    };
  }
}

export const walletService = new WalletService();
export default walletService;
