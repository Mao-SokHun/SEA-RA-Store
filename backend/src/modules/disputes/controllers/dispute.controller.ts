import { Request, Response, NextFunction } from 'express';
import { disputeService } from '../services/dispute.service';
import { sendCreated, sendSuccess } from '../../../common/utils/response';

export class DisputeController {
  createDispute = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orderNumber = req.params.orderNumber as string;
      const userId = req.user!.id;
      const userRole = req.user!.role;

      const result = await disputeService.createDispute(orderNumber, userId, userRole, req.body);
      sendCreated(res, result.dispute, result.message);
    } catch (error) {
      next(error);
    }
  };

  getDispute = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orderNumber = req.params.orderNumber as string;
      const userId = req.user!.id;
      const userRole = req.user!.role;

      const dispute = await disputeService.getDispute(orderNumber, userId, userRole);
      sendSuccess(res, dispute, 'Dispute retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  adminListDisputes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const status = req.query.status as string | undefined;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;

      const result = await disputeService.adminListDisputes(status, page, limit);
      sendSuccess(res, result.disputes, 'Disputes list retrieved successfully', 200, result.meta);
    } catch (error) {
      next(error);
    }
  };

  adminResolveDispute = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orderNumber = req.params.orderNumber as string;
      const adminId = req.user!.id;

      const result = await disputeService.adminResolveDispute(orderNumber, req.body, adminId);
      sendSuccess(res, result, result.message);
    } catch (error) {
      next(error);
    }
  };
}

export const disputeController = new DisputeController();
export default disputeController;
