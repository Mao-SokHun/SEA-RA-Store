import { Request, Response, NextFunction } from 'express';
import { chatService } from '../services/chat.service';
import { sendCreated, sendSuccess } from '../../../common/utils/response';

export class ChatController {
  sendMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orderNumber = req.params.orderNumber as string;
      const senderId = req.user!.id;
      const userRole = req.user!.role;

      const message = await chatService.sendMessage(orderNumber, senderId, userRole, req.body);
      sendCreated(res, message, 'Message sent successfully');
    } catch (error) {
      next(error);
    }
  };

  getChatHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orderNumber = req.params.orderNumber as string;
      const userId = req.user!.id;
      const userRole = req.user!.role;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 50;

      const result = await chatService.getChatHistory(orderNumber, userId, userRole, page, limit);
      sendSuccess(res, result.messages, 'Chat history retrieved successfully', 200, result.meta);
    } catch (error) {
      next(error);
    }
  };
}

export const chatController = new ChatController();
export default chatController;
