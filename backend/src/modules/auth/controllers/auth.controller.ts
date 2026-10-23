import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { sendCreated, sendSuccess } from '../../../common/utils/response';
import { config } from '../../../config';

export class AuthController {
  /**
   * Helper to set secure httpOnly refresh token cookie
   */
  private setRefreshTokenCookie(res: Response, token: string): void {
    res.cookie('refreshToken', token, {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: config.nodeEnv === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: `${config.apiPrefix}/auth/refresh-token`,
    });
  }

  private clearRefreshTokenCookie(res: Response): void {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: config.nodeEnv === 'production' ? 'none' : 'lax',
      path: `${config.apiPrefix}/auth/refresh-token`,
    });
  }

  /**
   * POST /api/v1/auth/register
   */
  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const ipAddress = req.ip || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'];

      const result = await authService.register({
        ...req.body,
        ipAddress,
        userAgent,
      });

      this.setRefreshTokenCookie(res, result.tokens.refreshToken);

      sendCreated(res, {
        user: result.user,
        accessToken: result.tokens.accessToken,
        refreshToken: result.tokens.refreshToken,
      }, 'Account registered successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/auth/login
   */
  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const ipAddress = req.ip || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'];

      const result = await authService.login({
        ...req.body,
        ipAddress,
        userAgent,
      });

      this.setRefreshTokenCookie(res, result.tokens.refreshToken);

      sendSuccess(res, {
        user: result.user,
        accessToken: result.tokens.accessToken,
        refreshToken: result.tokens.refreshToken,
      }, 'Logged in successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/auth/refresh-token
   */
  refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Look for refresh token in cookies first, then in request body
      const token = req.cookies?.refreshToken || req.body?.refreshToken;
      const ipAddress = req.ip || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'];

      const result = await authService.refreshToken(token, ipAddress, userAgent);

      this.setRefreshTokenCookie(res, result.tokens.refreshToken);

      sendSuccess(res, {
        accessToken: result.tokens.accessToken,
        refreshToken: result.tokens.refreshToken,
      }, 'Token refreshed successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/auth/logout
   */
  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.cookies?.refreshToken || req.body?.refreshToken;
      const userId = req.user?.id;

      await authService.logout(token, userId);
      this.clearRefreshTokenCookie(res);

      sendSuccess(res, null, 'Logged out successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/auth/forgot-password
   */
  forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email } = req.body;
      const ipAddress = req.ip || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'];

      const result = await authService.forgotPassword(email, ipAddress, userAgent);
      sendSuccess(res, result, result.message);
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/auth/reset-password
   */
  resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { token, newPassword } = req.body;
      const ipAddress = req.ip || req.socket.remoteAddress;

      const result = await authService.resetPassword(token, newPassword, ipAddress);
      sendSuccess(res, null, result.message);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/auth/me
   */
  getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        return next();
      }
      const result = await authService.getProfile(req.user.id);
      sendSuccess(res, result.user, 'Current user profile');
    } catch (error) {
      next(error);
    }
  };
}

export const authController = new AuthController();
export default authController;
