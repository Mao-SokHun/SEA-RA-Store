import { Router } from 'express';
import { chatController } from '../controllers/chat.controller';
import { authenticate } from '../../../common/middleware/auth';
import { validate } from '../../../common/middleware/validate';
import { preventDoubleSubmit } from '../../../common/middleware/antiDoubleSubmit';
import { sendMessageValidator, getChatHistoryValidator } from '../validators/chat.validator';

const router = Router();

// Escrow chat requires authentication
router.use(authenticate);

/**
 * @route   GET /api/v1/chat/:orderNumber
 * @desc    Get escrow chat message history for an order
 * @access  Private (Buyer, Seller, Admin)
 */
router.get(
  '/:orderNumber',
  getChatHistoryValidator,
  validate,
  chatController.getChatHistory
);

/**
 * @route   POST /api/v1/chat/:orderNumber
 * @desc    Send a message in the order's escrow chat
 * @access  Private (Buyer, Seller, Admin)
 */
router.post(
  '/:orderNumber',
  preventDoubleSubmit({ windowMs: 1500, message: 'Message is currently sending. Please do not spam clicks.' }),
  sendMessageValidator,
  validate,
  chatController.sendMessage
);

export default router;
