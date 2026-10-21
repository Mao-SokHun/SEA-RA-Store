import { prisma } from '../../../config/database';
import { NotFoundError } from '../../../common/errors/AppError';
import { config } from '../../../config';

export class ReferralService {
  /**
   * Get user's referral summary, invite code, shareable link, and reward history
   */
  async getMyReferralOverview(userId: string) {
    const userIdBigInt = BigInt(userId);

    const user = await prisma.user.findUnique({
      where: { id: userIdBigInt },
      select: {
        id: true,
        username: true,
        referralCode: true,
      },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const [totalReferred, completedReferrals, rewards, totalEarnedAgg] = await Promise.all([
      // Total invited
      prisma.userReferral.count({
        where: { referrerId: userIdBigInt },
      }),
      // Completed (referee made first purchase)
      prisma.userReferral.count({
        where: {
          referrerId: userIdBigInt,
          status: 'completed',
        },
      }),
      // Recent rewards
      prisma.referralReward.findMany({
        where: { referrerId: userIdBigInt },
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          order: { select: { orderNumber: true } },
          referral: {
            include: {
              referee: { select: { username: true } },
            },
          },
        },
      }),
      // Total earned
      prisma.referralReward.aggregate({
        where: { referrerId: userIdBigInt },
        _sum: { rewardAmount: true },
      }),
    ]);

    const shareUrl = `${config.frontendUrl}/register?ref=${user.referralCode}`;

    return {
      referralCode: user.referralCode,
      shareUrl,
      stats: {
        totalReferred,
        completedReferrals,
        pendingReferrals: Math.max(0, totalReferred - completedReferrals),
        totalEarned: Number(totalEarnedAgg._sum.rewardAmount || 0),
        commissionRate: '2% of first purchase (min $0.50)',
      },
      rewards: rewards.map((r) => ({
        id: r.id.toString(),
        orderNumber: r.order.orderNumber,
        refereeUsername: r.referral.referee.username,
        rewardAmount: Number(r.rewardAmount),
        status: r.status,
        createdAt: r.createdAt,
      })),
    };
  }
}

export const referralService = new ReferralService();
export default referralService;
