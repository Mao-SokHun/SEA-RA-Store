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
 * @route   GET /api/v1/topup/track-orders
 * @desc    Track & search orders for guest users by Phone, Player ID, or Order Number
 * @access  Public
 */
router.get('/track-orders', topUpController.trackGuestOrders);

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
 * @route   GET /api/v1/topup/orders/:orderNumber/check-payment
 * @desc    Auto-poll and check if customer has scanned and paid Bakong KHQR
 * @access  Public
 */
router.get(
  '/orders/:orderNumber/check-payment',
  topUpOrderParamValidator,
  validate,
  topUpController.checkBakongPayment
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
 * @route   POST /api/v1/topup/test-telegram
 * @desc    Test Telegram Bot Notification configuration
 * @access  Public / Developer
 */
router.post('/test-telegram', topUpController.testTelegram);

/**
 * @route   GET /api/v1/topup/my-orders
 * @desc    Get user's top-up orders history
 * @access  Private
 */
router.get('/my-orders', authenticate, topUpController.getMyOrders);

export default router;
