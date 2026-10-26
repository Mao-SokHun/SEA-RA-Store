import { Router } from 'express';
import { topUpController } from '../controllers/topup.controller';
import { authenticate, optionalAuth } from '../../../common/middleware/auth';
import { checkoutLimiter } from '../../../common/middleware/rateLimiter';
import { preventDoubleSubmit } from '../../../common/middleware/antiDoubleSubmit';
import { validate } from '../../../common/middleware/validate';
import {
  verifyPlayerValidator,
  createTopUpOrderValidator,
  topUpOrderParamValidator,
} from '../validators/topup.validator';

const router = Router();

/**
 * @route   GET /api/v1/topup/games
 * @desc    Get all active games available for top-up with configurations
 * @access  Public
 */
router.get('/games', topUpController.getGames);

/**
 * @route   GET /api/v1/topup/games/:gameId
 * @desc    Get top-up packages and input specifications for a specific game
 * @access  Public
 */
router.get('/games/:gameId', topUpController.getGameDetails);

/**
 * @route   POST /api/v1/topup/check-player
 * @desc    Verify player ID and retrieve in-game nickname
 * @access  Public
 */
router.post(
  '/check-player',
  verifyPlayerValidator,
  validate,
  topUpController.verifyPlayer
);

/**
 * @route   POST /api/v1/topup/orders
 * @desc    Create top-up order (via Bakong KHQR or Wallet)
 * @access  Public (Guest or Authenticated user)
 */
router.post(
  '/orders',
  optionalAuth,
  preventDoubleSubmit({ windowMs: 3000, message: 'Top-up order is being processed. Please do not submit repeatedly.' }),
  checkoutLimiter,
  createTopUpOrderValidator,
  validate,
  topUpController.createOrder
);

/**
 * @route   GET /api/v1/topup/orders/:orderNumber
 * @desc    Get top-up order status and payment details
 * @access  Public
 */
router.get(
  '/orders/:orderNumber',
  topUpOrderParamValidator,
  validate,
  topUpController.getOrderStatus
);

/**
 * @route   POST /api/v1/topup/orders/:orderNumber/simulate-payment
 * @desc    Simulate Bakong KHQR payment scan and trigger instant in-game credit
 * @access  Public (Dev / Sandbox)
 */
router.post(
  '/orders/:orderNumber/simulate-payment',
  topUpOrderParamValidator,
  validate,
  topUpController.simulatePayment
);

/**
 * @route   GET /api/v1/topup/my-orders
 * @desc    Get user's top-up orders history
 * @access  Private
 */
router.get('/my-orders', authenticate, topUpController.getMyOrders);

export default router;
