import { prisma } from '../../../config/database';

export class AdminService {
  /**
   * Get high-level executive dashboard statistics for platform administration
   */
  async getDashboardStats() {
    const [
      totalUsers,
      totalBuyers,
      totalSellers,
      totalAccounts,
      availableAccounts,
      soldAccounts,
      completedOrdersAgg,
      escrowOrdersAgg,
      pendingWithdrawalsCount,
      openDisputesCount,
    ] = await Promise.all([
      // Users
      prisma.user.count(),
      prisma.user.count({ where: { role: 'buyer' } }),
      prisma.user.count({ where: { role: 'seller' } }),
      // Accounts
      prisma.gameAccount.count(),
      prisma.gameAccount.count({ where: { status: 'available' } }),
      prisma.gameAccount.count({ where: { status: 'sold' } }),
      // Completed Orders Financials
      prisma.order.aggregate({
        where: { status: 'completed' },
        _sum: {
          totalAmount: true,
          platformFee: true,
          sellerNetAmount: true,
        },
        _count: true,
      }),
      // In-Escrow Funds Held
      prisma.order.aggregate({
        where: { status: 'in_escrow' },
        _sum: { totalAmount: true },
        _count: true,
      }),
      // Action items
      prisma.withdrawalRequest.count({ where: { status: 'pending' } }),
      prisma.dispute.count({ where: { status: 'open' } }),
    ]);

    return {
      users: {
        total: totalUsers,
        buyers: totalBuyers,
        sellers: totalSellers,
      },
      inventory: {
        totalListings: totalAccounts,
        available: availableAccounts,
        sold: soldAccounts,
        reservedOrOther: totalAccounts - availableAccounts - soldAccounts,
      },
      financials: {
        totalTradingVolume: Number(completedOrdersAgg._sum.totalAmount || 0),
        totalPlatformCommission: Number(completedOrdersAgg._sum.platformFee || 0),
        totalSellerPayouts: Number(completedOrdersAgg._sum.sellerNetAmount || 0),
        totalCompletedOrders: completedOrdersAgg._count,
        escrowHeldAmount: Number(escrowOrdersAgg._sum.totalAmount || 0),
        escrowHeldOrdersCount: escrowOrdersAgg._count,
        currency: 'USD',
      },
      actionItems: {
        pendingWithdrawals: pendingWithdrawalsCount,
        openDisputes: openDisputesCount,
      },
      timestamp: new Date(),
    };
  }
}

export const adminService = new AdminService();
export default adminService;
