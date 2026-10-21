import { Request, Response, NextFunction } from 'express';
import { orderService } from '../services/order.service';
import { sendCreated, sendSuccess } from '../../../common/utils/response';

export class OrderController {
  checkout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const buyerId = req.user!.id;
      const ipAddress = req.ip || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'];

      const result = await orderService.checkout(buyerId, {
        ...req.body,
        ipAddress,
        userAgent,
      });

      sendCreated(res, result, 'Order created successfully. 15-minute reservation timer started.');
    } catch (error) {
      next(error);
    }
  };

  getOrderDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { orderNumber } = req.params;
      const userId = req.user!.id;
      const userRole = req.user!.role;

      const order = await orderService.getOrderDetails(orderNumber, userId, userRole);
      sendSuccess(res, order, 'Order details retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  cancelOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { orderNumber } = req.params;
      const userId = req.user!.id;
      const userRole = req.user!.role;

      const result = await orderService.cancelOrder(orderNumber, userId, userRole);
      sendSuccess(res, null, result.message);
    } catch (error) {
      next(error);
    }
  };

  confirmReceived = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { orderNumber } = req.params;
      const buyerId = req.user!.id;

      const result = await orderService.confirmReceived(orderNumber, buyerId);
      sendSuccess(res, null, result.message);
    } catch (error) {
      next(error);
    }
  };

  getUserOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const roleFilter = (req.query.role as 'buyer' | 'seller') || 'buyer';
      const statusFilter = req.query.status as string | undefined;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;

      const result = await orderService.getUserOrders(userId, roleFilter, statusFilter, page, limit);
      sendSuccess(res, result.orders, 'Orders retrieved successfully', 200, result.meta);
    } catch (error) {
      next(error);
    }
  };
}

export const orderController = new OrderController();
export default orderController;
