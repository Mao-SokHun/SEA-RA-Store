import { Request, Response, NextFunction } from 'express';
import { couponService } from '../services/coupon.service';
import { sendCreated, sendSuccess } from '../../../common/utils/response';

export class CouponController {
  validateCoupon = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const code = req.query.code as string;
      const orderAmount = Number(req.query.orderAmount);
      const buyerId = req.user?.id;

      const result = await couponService.validateCoupon(code, orderAmount, buyerId);
      sendSuccess(res, result.coupon, 'Coupon applied successfully');
    } catch (error) {
      next(error);
    }
  };

  getActiveCoupons = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const coupons = await couponService.getActiveCoupons();
      sendSuccess(res, coupons, 'Active coupons retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  createCoupon = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await couponService.createCoupon(req.body);
      sendCreated(res, result.coupon, result.message);
    } catch (error) {
      next(error);
    }
  };
}

export const couponController = new CouponController();
export default couponController;
