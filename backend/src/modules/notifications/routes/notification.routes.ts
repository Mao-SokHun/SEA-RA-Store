import { Router, Request, Response } from 'express';
import { telegramService } from '../services/telegram.service';

const router = Router();

/**
 * @route   POST /api/v1/notifications/telegram/webhook
 * @desc    Incoming Telegram Bot webhook updates (/start <token>)
 * @access  Public (called by Telegram server)
 */
router.post('/telegram/webhook', async (req: Request, res: Response) => {
  try {
    await telegramService.handleWebhookUpdate(req.body);
  } catch (err) {
    console.error('Error handling Telegram webhook:', err);
  }
  // Telegram expects 200 OK response
  res.status(200).json({ ok: true });
});

export default router;
