import { Request, Response, NextFunction } from 'express';
import { adminService } from '../services/admin.service';
import { userService } from '../../users/services/user.service';
import { cronService } from '../../../common/services/cron.service';
import { sendSuccess } from '../../../common/utils/response';

export class AdminController {
  getDashboardStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const stats = await adminService.getDashboardStats();
      sendSuccess(res, stats, 'Admin dashboard statistics retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  listKYC = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const status = req.query.status as string | undefined;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      const result = await userService.adminListKYC(status, page, limit);
      sendSuccess(res, result, 'KYC submissions retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  reviewKYC = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const kycId = req.params.id as string;
      const { action, rejectionReason } = req.body;
      const adminId = req.user?.id;
      const result = await userService.adminReviewKYC(kycId, action, rejectionReason, adminId);
      sendSuccess(res, null, result.message);
    } catch (error) {
      next(error);
    }
  };

  triggerCron = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const job = (req.body.job as string) || 'all';
      const results: Record<string, any> = {};

      if (job === 'reservations' || job === 'all') {
        results.reservationsReleased = await cronService.runReservationCleanup();
      }
      if (job === 'escrow' || job === 'all') {
        const hours = Number(req.body.inspectionHours) || 24;
        results.escrowReleased = await cronService.runEscrowAutoRelease(hours);
      }
      if (job === 'tokens' || job === 'all') {
        results.tokensCleaned = await cronService.runTokenCleanup();
      }

      sendSuccess(res, results, 'Cron background jobs triggered successfully');
    } catch (error) {
      next(error);
    }
  };
}

export const adminController = new AdminController();
export default adminController;
