import { Router } from 'express';
import { couponController } from '../controllers/coupon.controller';
import { authenticate, optionalAuth, authorize } from '../../../common/middleware/auth';
import { query, body } from 'express-validator';
import { validate } from '../../../common/middleware/validate';

const router = Router();

/**
 * @route   GET /api/v1/coupons/validate
 * @desc    Validate a promo coupon code against order amount
 * @access  Public / Optional Auth
 */
router.get(
  '/validate',
  optionalAuth,
  [
    query('code').trim().notEmpty().withMessage('Coupon code is required'),
    query('orderAmount').isFloat({ min: 0.1 }).withMessage('Valid order amount is required'),
  ],
  validate,
  couponController.validateCoupon
);

/**
 * @route   GET /api/v1/coupons/active
 * @desc    Get currently active promotional coupons
 * @access  Public
 */
router.get('/active', couponController.getActiveCoupons);

/**
 * @route   POST /api/v1/coupons
 * @desc    Admin: Create a new promotional discount coupon
 * @access  Private (Admin only)
 */
router.post(
  '/',
  authenticate,
  authorize('admin'),
  [
    body('code').trim().notEmpty().isLength({ min: 3, max: 50 }).withMessage('Valid coupon code is required'),
    body('discountType').isIn(['percentage', 'fixed']).withMessage('discountType must be percentage or fixed'),
    body('discountValue').isFloat({ min: 0.01 }).withMessage('discountValue must be greater than 0'),
    body('validUntil').isISO8601().withMessage('validUntil must be a valid ISO8601 date'),
  ],
  validate,
  couponController.createCoupon
);

export default router;
