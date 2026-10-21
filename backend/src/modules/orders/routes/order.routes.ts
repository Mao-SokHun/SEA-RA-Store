import { Router } from 'express';
import { orderController } from '../controllers/order.controller';
import { validate } from '../../../common/middleware/validate';
import { authenticate } from '../../../common/middleware/auth';
import {
  checkoutValidator,
  orderNumberParamValidator,
  queryOrdersValidator,
} from '../validators/order.validator';

const router = Router();

// All order endpoints require authentication
router.use(authenticate);

/**
 * @route   POST /api/v1/orders/checkout
 * @desc    Initiate checkout and lock account with 15-minute reservation timer
 * @access  Private
 */
router.post('/checkout', checkoutValidator, validate, orderController.checkout);

/**
 * @route   GET /api/v1/orders
 * @desc    Get user's orders (as buyer or as seller)
 * @access  Private
 */
router.get('/', queryOrdersValidator, validate, orderController.getUserOrders);

/**
 * @route   GET /api/v1/orders/:orderNumber
 * @desc    Get order details (with decrypted credentials if buyer & paid)
 * @access  Private (Buyer, Seller, or Admin)
 */
router.get('/:orderNumber', orderNumberParamValidator, validate, orderController.getOrderDetails);

/**
 * @route   POST /api/v1/orders/:orderNumber/cancel
 * @desc    Cancel unpaid order & release 15-min reservation lock
 * @access  Private (Buyer or Admin)
 */
router.post('/:orderNumber/cancel', orderNumberParamValidator, validate, orderController.cancelOrder);

/**
 * @route   POST /api/v1/orders/:orderNumber/confirm-received
 * @desc    Buyer confirms account handover -> releases escrow funds to seller wallet
 * @access  Private (Buyer only)
 */
router.post(
  '/:orderNumber/confirm-received',
  orderNumberParamValidator,
  validate,
  orderController.confirmReceived
);

export default router;
