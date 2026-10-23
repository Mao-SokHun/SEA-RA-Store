import { Router } from 'express';
import { adminController } from '../controllers/admin.controller';
import { authenticate, authorize } from '../../../common/middleware/auth';

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

export default router;
