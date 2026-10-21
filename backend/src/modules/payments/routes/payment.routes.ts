import { Router } from 'express';
import { paymentController } from '../controllers/payment.controller';
import { validate } from '../../../common/middleware/validate';
import { authenticate } from '../../../common/middleware/auth';
import { preventDoubleSubmit } from '../../../common/middleware/antiDoubleSubmit';
import {
  createKHQRValidator,
  payWithWalletValidator,
  paymentOrderParamValidator,
  mockPaymentValidator,
} from '../validators/payment.validator';

const router = Router();

/**
 * @route   POST /api/v1/payments/khqr
 * @desc    Generate Bakong KHQR String and Base64 PNG image for an order
 * @access  Private (Buyer)
 */
router.post(
  '/khqr',
  authenticate,
  preventDoubleSubmit({ windowMs: 2500 }),
  createKHQRValidator,
  validate,
  paymentController.generateKHQR
);

/**
 * @route   POST /api/v1/payments/wallet
 * @desc    Pay for an order using internal platform wallet balance
 * @access  Private (Buyer)
 */
router.post(
  '/wallet',
  authenticate,
  preventDoubleSubmit({ windowMs: 4000, message: 'Wallet payment is currently processing. Please do not click multiple times.' }),
  payWithWalletValidator,
  validate,
  paymentController.payWithWallet
);

/**
 * @route   POST /api/v1/payments/webhook/bakong
 * @desc    Bakong payment confirmation webhook
 * @access  Public (HMAC Verified)
 */
router.post('/webhook/bakong', paymentController.handleWebhook);

/**
 * @route   POST /api/v1/payments/simulate
 * @desc    Simulate payment completion for testing in sandbox/dev
 * @access  Private (Buyer / Admin)
 */
router.post(
  '/simulate',
  authenticate,
  preventDoubleSubmit({ windowMs: 3000 }),
  mockPaymentValidator,
  validate,
  paymentController.simulatePayment
);

/**
 * @route   GET /api/v1/payments/status/:orderNumber
 * @desc    Get real-time payment status of an order (polled by frontend)
 * @access  Public
 */
router.get(
  '/status/:orderNumber',
  paymentOrderParamValidator,
  validate,
  paymentController.getPaymentStatus
);

export default router;
