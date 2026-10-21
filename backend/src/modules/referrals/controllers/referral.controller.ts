import { Request, Response, NextFunction } from 'express';
import { referralService } from '../services/referral.service';
import { sendSuccess } from '../../../common/utils/response';

export class ReferralController {
  getMyReferralOverview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const result = await referralService.getMyReferralOverview(userId);
      sendSuccess(res, result, 'Referral overview retrieved successfully');
    } catch (error) {
      next(error);
    }
  };
}

export const referralController = new ReferralController();
export default referralController;
