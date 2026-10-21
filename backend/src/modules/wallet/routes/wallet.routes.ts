import { Router } from 'express';
import { walletController } from '../controllers/wallet.controller';
import { authenticate, authorize } from '../../../common/middleware/auth';
import { validate } from '../../../common/middleware/validate';
import { preventDoubleSubmit } from '../../../common/middleware/antiDoubleSubmit';
import {
  withdrawValidator,
  queryTransactionsValidator,
  adminWithdrawalActionValidator,
  topupValidator,
} from '../validators/wallet.validator';

const router = Router();

// All wallet endpoints require authentication
router.use(authenticate);

/**
 * @route   GET /api/v1/wallet
 * @desc    Get user's wallet overview (balance, earnings, payouts, recent transactions)
 * @access  Private (User/Seller/Admin)
 */
router.get('/', walletController.getWallet);

/**
 * @route   GET /api/v1/wallet/transactions
 * @desc    Get paginated transaction ledger
 * @access  Private
 */
router.get(
  '/transactions',
  queryTransactionsValidator,
  validate,
  walletController.getTransactions
);

/**
 * @route   POST /api/v1/wallet/withdraw
 * @desc    Request withdrawal of seller balance to bank account
 * @access  Private
 */
router.post(
  '/withdraw',
  preventDoubleSubmit({ windowMs: 5000, message: 'Withdrawal request is currently processing. Please do not click repeatedly.' }),
  withdrawValidator,
  validate,
  walletController.requestWithdrawal
);

/**
 * @route   GET /api/v1/wallet/withdrawals
 * @desc    Get user's withdrawal request history
 * @access  Private
 */
router.get('/withdrawals', walletController.getMyWithdrawals);

/**
 * @route   POST /api/v1/wallet/topup
 * @desc    Simulate/test wallet balance top-up
 * @access  Private
 */
router.post(
  '/topup',
  preventDoubleSubmit({ windowMs: 4000 }),
  topupValidator,
  validate,
  walletController.topup
);

/**
 * @route   GET /api/v1/wallet/admin/withdrawals
 * @desc    Admin: List all withdrawal requests across the platform
 * @access  Private (Admin only)
 */
router.get(
  '/admin/withdrawals',
  authorize('admin'),
  walletController.adminGetWithdrawals
);

/**
 * @route   POST /api/v1/wallet/admin/withdrawals/:id/approve
 * @desc    Admin: Approve payout request
 * @access  Private (Admin only)
 */
router.post(
  '/admin/withdrawals/:id/approve',
  authorize('admin'),
  preventDoubleSubmit({ windowMs: 3000 }),
  adminWithdrawalActionValidator,
  validate,
  walletController.adminApproveWithdrawal
);

/**
 * @route   POST /api/v1/wallet/admin/withdrawals/:id/reject
 * @desc    Admin: Reject payout request & auto-refund user balance
 * @access  Private (Admin only)
 */
router.post(
  '/admin/withdrawals/:id/reject',
  authorize('admin'),
  preventDoubleSubmit({ windowMs: 3000 }),
  adminWithdrawalActionValidator,
  validate,
  walletController.adminRejectWithdrawal
);

export default router;
