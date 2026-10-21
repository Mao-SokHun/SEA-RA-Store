import { Router } from 'express';
import { disputeController } from '../controllers/dispute.controller';
import { authenticate, authorize } from '../../../common/middleware/auth';
import { validate } from '../../../common/middleware/validate';
import {
  createDisputeValidator,
  resolveDisputeValidator,
  queryDisputesValidator,
} from '../validators/dispute.validator';

const router = Router();

// All dispute routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/v1/disputes/admin
 * @desc    Admin: List all disputes across orders
 * @access  Private (Admin only)
 */
router.get(
  '/admin',
  authorize('admin'),
  queryDisputesValidator,
  validate,
  disputeController.adminListDisputes
);

/**
 * @route   POST /api/v1/disputes/admin/:orderNumber/resolve
 * @desc    Admin: Resolve a dispute (refund buyer or payout seller)
 * @access  Private (Admin only)
 */
router.post(
  '/admin/:orderNumber/resolve',
  authorize('admin'),
  resolveDisputeValidator,
  validate,
  disputeController.adminResolveDispute
);

/**
 * @route   GET /api/v1/disputes/:orderNumber
 * @desc    Get dispute details for an order
 * @access  Private (Buyer, Seller, Admin)
 */
router.get(
  '/:orderNumber',
  disputeController.getDispute
);

/**
 * @route   POST /api/v1/disputes/:orderNumber
 * @desc    Open a dispute on an order
 * @access  Private (Buyer, Seller)
 */
router.post(
  '/:orderNumber',
  createDisputeValidator,
  validate,
  disputeController.createDispute
);

export default router;
