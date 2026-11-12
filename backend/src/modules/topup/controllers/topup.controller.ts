import { Request, Response, NextFunction } from 'express';
import { topUpService } from '../services/topup.service';
import { sendCreated, sendSuccess } from '../../../common/utils/response';
import { telegramService } from '../../../common/services/telegram.service';

export class TopUpController {
  /**
   * GET /api/v1/topup/games
   */
  getGames = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const games = await topUpService.getTopUpGames();
      sendSuccess(res, games, 'Top-up games retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/topup/games/:gameId
   */
  getGameDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const gameId = req.params.gameId as string;
      const details = await topUpService.getGameTopUpDetails(gameId);
      sendSuccess(res, details, 'Game top-up packages retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/topup/check-player
   */
  verifyPlayer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { gameId, playerId, zoneId, serverRegion } = req.body;
      const result = await topUpService.verifyPlayer(gameId, playerId, zoneId, serverRegion);
      sendSuccess(res, result, 'Player account verified successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/topup/orders
   */
  createOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user?.id || null;
      const order = await topUpService.createTopUpOrder(userId, req.body);
      sendCreated(res, order, 'Top-up order created successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/topup/orders/:orderNumber
   */
  getOrderStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orderNumber = req.params.orderNumber as string;
      const order = await topUpService.getOrderStatus(orderNumber);
      sendSuccess(res, order, 'Top-up order details retrieved');
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/topup/orders/:orderNumber/check-payment
   * Automated polling for Bakong KHQR payment confirmation
   */
  checkBakongPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orderNumber = req.params.orderNumber as string;
      const result = await topUpService.checkBakongPayment(orderNumber);
      sendSuccess(res, result, result.message);
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/topup/orders/:orderNumber/simulate-payment
   */
  simulatePayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orderNumber = req.params.orderNumber as string;
      const result = await topUpService.simulatePayment(orderNumber);
      sendSuccess(res, result, result.message);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/topup/my-orders
   */
  getMyOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user?.id;
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 20;
      const history = await topUpService.getUserOrders(userId, page, limit);
      sendSuccess(res, history, 'User top-up orders retrieved');
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/topup/track-orders
   * Public guest lookup by orderNumber, playerId, or contactPhone
   */
  trackGuestOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = (req.query.query as string) || '';
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = Math.min(parseInt(req.query.limit as string, 10) || 20, 50);
      const result = await topUpService.trackGuestOrders(query, page, limit);
      sendSuccess(res, result, 'Top-up orders tracked successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/topup/test-telegram
   * Test Telegram bot notification configuration
   */
  testTelegram = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const sent = await telegramService.notifyNewOrder({
        orderNumber: `TEST-${Date.now().toString().slice(-4)}`,
        gameTitle: 'Mobile Legends: Bang Bang',
        packageName: '86 Diamonds (Test Notification)',
        totalUSD: 1.45,
        playerId: '18273645',
        zoneId: '2001',
        playerNickname: 'SEARA_ADMIN_TEST',
        paymentMethod: 'bakong_khqr',
        deliveryStatus: 'pending',
      });
      sendSuccess(
        res,
        { sent, configured: telegramService.isConfigured() },
        sent
          ? 'Telegram test alert delivered successfully to your channel/chat'
          : 'Telegram bot credentials not configured in .env or failed to send'
      );
    } catch (error) {
      next(error);
    }
  };
}

export const topUpController = new TopUpController();
export default topUpController;
