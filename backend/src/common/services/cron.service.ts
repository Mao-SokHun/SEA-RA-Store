import { prisma } from '../../config/database';
import { orderService } from '../../modules/orders/services/order.service';

export class CronService {
  private reservationTimer: NodeJS.Timeout | null = null;
  private escrowTimer: NodeJS.Timeout | null = null;
  private tokenCleanupTimer: NodeJS.Timeout | null = null;

  private isRunningReservations = false;
  private isRunningEscrow = false;
  private isRunningTokenCleanup = false;

  /**
   * Start all scheduled background jobs
   */
  start(): void {
    console.log('⏰ Starting background Cron Services...');

    // 1. Release expired 15-min reservations every 60 seconds
    this.reservationTimer = setInterval(async () => {
      await this.runReservationCleanup();
    }, 60 * 1000);

    // 2. Auto-release Escrow funds (24-hour inspection) every 10 minutes
    this.escrowTimer = setInterval(async () => {
      await this.runEscrowAutoRelease();
    }, 10 * 60 * 1000);

    // 3. Clean up expired refresh & reset tokens once every 24 hours
    this.tokenCleanupTimer = setInterval(async () => {
      await this.runTokenCleanup();
    }, 24 * 60 * 60 * 1000);

    // Run initial checks on startup (delayed 5s to let server bind)
    setTimeout(() => {
      this.runReservationCleanup().catch(console.error);
      this.runEscrowAutoRelease().catch(console.error);
    }, 5000);
  }

  /**
   * Stop all scheduled background jobs gracefully
   */
  stop(): void {
    if (this.reservationTimer) {
      clearInterval(this.reservationTimer);
      this.reservationTimer = null;
    }
    if (this.escrowTimer) {
      clearInterval(this.escrowTimer);
      this.escrowTimer = null;
    }
    if (this.tokenCleanupTimer) {
      clearInterval(this.tokenCleanupTimer);
      this.tokenCleanupTimer = null;
    }
    console.log('🛑 Background Cron Services stopped.');
  }

  /**
   * Job 1: Release expired reservations
   */
  async runReservationCleanup(): Promise<number> {
    if (this.isRunningReservations) return 0;
    this.isRunningReservations = true;
    try {
      const releasedCount = await orderService.releaseExpiredReservations();
      if (releasedCount > 0) {
        console.log(`[CRON] 🔓 Auto-released ${releasedCount} expired order reservation(s).`);
      }
      return releasedCount;
    } catch (err) {
      console.error('[CRON] Error releasing expired reservations:', err);
      return 0;
    } finally {
      this.isRunningReservations = false;
    }
  }

  /**
   * Job 2: Auto-release Escrow funds (24-hour inspection period)
   */
  async runEscrowAutoRelease(inspectionHours = 24): Promise<number> {
    if (this.isRunningEscrow) return 0;
    this.isRunningEscrow = true;
    try {
      const releasedCount = await orderService.autoReleaseEscrow(inspectionHours);
      if (releasedCount > 0) {
        console.log(`[CRON] 💰 Auto-released ${releasedCount} escrow order(s) to sellers.`);
      }
      return releasedCount;
    } catch (err) {
      console.error('[CRON] Error in escrow auto-release:', err);
      return 0;
    } finally {
      this.isRunningEscrow = false;
    }
  }

  /**
   * Job 3: Clean up expired & revoked tokens
   */
  async runTokenCleanup(): Promise<{ refreshTokens: number; resetTokens: number }> {
    if (this.isRunningTokenCleanup) return { refreshTokens: 0, resetTokens: 0 };
    this.isRunningTokenCleanup = true;
    try {
      const now = new Date();

      const [refreshRes, resetRes] = await Promise.all([
        prisma.userRefreshToken.deleteMany({
          where: {
            OR: [{ isRevoked: true }, { expiresAt: { lt: now } }],
          },
        }),
        prisma.passwordResetToken.deleteMany({
          where: {
            OR: [{ isUsed: true }, { expiresAt: { lt: now } }],
          },
        }),
      ]);

      if (refreshRes.count > 0 || resetRes.count > 0) {
        console.log(
          `[CRON] 🧹 Cleaned up ${refreshRes.count} expired refresh token(s) and ${resetRes.count} reset token(s).`
        );
      }

      return { refreshTokens: refreshRes.count, resetTokens: resetRes.count };
    } catch (err) {
      console.error('[CRON] Error cleaning up expired tokens:', err);
      return { refreshTokens: 0, resetTokens: 0 };
    } finally {
      this.isRunningTokenCleanup = false;
    }
  }
}

export const cronService = new CronService();
export default cronService;
