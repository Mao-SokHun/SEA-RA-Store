import { Router } from 'express';
import { adminController } from '../controllers/admin.controller';
import { authenticate, authorize } from '../../../common/middleware/auth';
import { validate } from '../../../common/middleware/validate';
import { preventDoubleSubmit } from '../../../common/middleware/antiDoubleSubmit';
import { listKYCQueryValidator, reviewKYCValidator } from '../../users/validators/kyc.validator';

const router = Router();

// All admin endpoints require authentication and 'admin' role
router.use(authenticate, authorize('admin'));

/**
 * @route   GET /api/v1/admin/dashboard/stats
 * @desc    Get executive platform statistics (volume, commission, escrow, inventory)
 * @access  Private (Admin only)
 */
router.get('/dashboard/stats', adminController.getDashboardStats);
router.get('/analytics/overview', adminController.getDashboardStats);

/**
 * @route   GET /api/v1/admin/kyc
 * @desc    List all submitted KYC applications for seller approval
 * @access  Private (Admin only)
 */
router.get('/kyc', listKYCQueryValidator, validate, adminController.listKYC);

/**
 * @route   POST /api/v1/admin/kyc/:id/review
 * @desc    Approve or reject a seller KYC application
 * @access  Private (Admin only)
 */
router.post(
  '/kyc/:id/review',
  preventDoubleSubmit({ windowMs: 3000 }),
  reviewKYCValidator,
  validate,
  adminController.reviewKYC
);

/**
 * @route   POST /api/v1/admin/cron/trigger
 * @desc    Manually trigger background maintenance jobs (reservations, escrow, token cleanup)
 * @access  Private (Admin only)
 */
router.post('/cron/trigger', adminController.triggerCron);

export default router;
