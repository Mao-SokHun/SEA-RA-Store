import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service';
import { telegramService } from '../../notifications/services/telegram.service';
import { sendSuccess } from '../../../common/utils/response';

export class UserController {
  updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const result = await userService.updateProfile(userId, req.body);
      sendSuccess(res, result.user, result.message);
    } catch (error) {
      next(error);
    }
  };

  changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const result = await userService.changePassword(userId, req.body);
      sendSuccess(res, null, result.message);
    } catch (error) {
      next(error);
    }
  };

  getTelegramSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const settings = await userService.getTelegramSettings(userId);
      sendSuccess(res, settings, 'Telegram settings retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  updateTelegramSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const result = await userService.updateTelegramSettings(userId, req.body);
      sendSuccess(res, result.settings, result.message);
    } catch (error) {
      next(error);
    }
  };

  getTelegramLinkToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const { token } = telegramService.generateLinkToken(userId);
      sendSuccess(res, { token, command: `/start ${token}` }, 'Telegram link token generated (valid for 15 minutes)');
    } catch (error) {
      next(error);
    }
  };

  submitKYC = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const result = await userService.submitKYC(userId, req.body);
      sendSuccess(res, result.kyc, result.message, 201);
    } catch (error) {
      next(error);
    }
  };

  getMyKYC = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const result = await userService.getMyKYC(userId);
      sendSuccess(res, result, 'KYC status retrieved successfully');
    } catch (error) {
      next(error);
    }
  };
}

export const userController = new UserController();
export default userController;
