import { Request, Response, NextFunction } from 'express';
import { paymentService } from '../services/payment.service';
import { sendCreated, sendSuccess } from '../../../common/utils/response';

export class PaymentController {
  generateKHQR = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const buyerId = req.user!.id;
      const result = await paymentService.generateKHQR(buyerId, req.body);
      sendCreated(res, result, 'Bakong KHQR generated successfully');
    } catch (error) {
      next(error);
    }
  };

  payWithWallet = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const buyerId = req.user!.id;
      const { orderNumber } = req.body;
      const result = await paymentService.payWithWallet(buyerId, orderNumber);
      sendSuccess(res, result, result.message);
    } catch (error) {
      next(error);
    }
  };

  handleWebhook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const signature = req.headers['x-bakong-signature'] as string | undefined;
      const rawPayload = JSON.stringify(req.body);

      const result = await paymentService.handleBakongWebhook(rawPayload, signature, req.body);
      sendSuccess(res, result, result.message);
    } catch (error) {
      next(error);
    }
  };

  simulatePayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { orderNumber } = req.body;
      const userId = req.user!.id;
      const userRole = req.user!.role;

      const result = await paymentService.simulatePayment(orderNumber, userId, userRole);
      sendSuccess(res, result, result.message);
    } catch (error) {
      next(error);
    }
  };

  getPaymentStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orderNumber = req.params.orderNumber as string;
      const result = await paymentService.getPaymentStatus(orderNumber);
      sendSuccess(res, result, 'Payment status retrieved successfully');
    } catch (error) {
      next(error);
    }
  };
}

export const paymentController = new PaymentController();
export default paymentController;
