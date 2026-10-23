import { Request, Response, NextFunction } from 'express';
import { walletService } from '../services/wallet.service';
import { sendCreated, sendSuccess } from '../../../common/utils/response';

export class WalletController {
  /**
   * GET /api/v1/wallet
   * Overview: balance, total earnings, pending/approved payouts, recent transactions
   */
  getWallet = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const result = await walletService.getWalletOverview(userId);
      sendSuccess(res, result, 'Wallet overview retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/wallet/transactions
   * Full paginated ledger transactions
   */
  getTransactions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const { transactionType, page = '1', limit = '20' } = req.query;

      const result = await walletService.getTransactions(
        userId,
        transactionType as string | undefined,
        Number(page),
        Number(limit)
      );

      sendSuccess(res, result.transactions, 'Wallet transactions retrieved successfully', 200, result.meta);
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/wallet/withdraw
   * Request withdrawal / seller payout
   */
  requestWithdrawal = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const ipAddress = req.ip || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'];

      const result = await walletService.requestWithdrawal(userId, {
        amount: Number(req.body.amount),
        bankName: req.body.bankName,
        accountNumber: req.body.accountNumber,
        accountName: req.body.accountName,
        ipAddress,
        userAgent,
      });

      sendCreated(res, result, result.message);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/wallet/withdrawals
   * List user's own withdrawal history
   */
  getMyWithdrawals = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const { page = '1', limit = '20' } = req.query;

      const result = await walletService.getMyWithdrawals(userId, Number(page), Number(limit));
      sendSuccess(res, result.withdrawals, 'Withdrawal requests retrieved successfully', 200, result.meta);
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/wallet/topup
   * Top up wallet balance (Simulation/Credit)
   */
  topup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const userRole = req.user!.role;
      const amount = Number(req.body.amount);

      const result = await walletService.topup(userId, amount, userRole);
      sendSuccess(res, result, result.message);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Admin: GET /api/v1/wallet/admin/withdrawals
   */
  adminGetWithdrawals = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { status, page = '1', limit = '20' } = req.query;

      const result = await walletService.adminGetWithdrawals(
        status as string | undefined,
        Number(page),
        Number(limit)
      );

      sendSuccess(res, result.withdrawals, 'Admin withdrawals retrieved successfully', 200, result.meta);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Admin: POST /api/v1/wallet/admin/withdrawals/:id/approve
   */
  adminApproveWithdrawal = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const adminId = req.user!.id;
      const { adminNotes } = req.body;

      const result = await walletService.adminApproveWithdrawal(id, adminNotes, adminId);
      sendSuccess(res, result, result.message);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Admin: POST /api/v1/wallet/admin/withdrawals/:id/reject
   */
  adminRejectWithdrawal = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const adminId = req.user!.id;
      const { reason = 'Rejected by administrator' } = req.body;

      const result = await walletService.adminRejectWithdrawal(id, reason, adminId);
      sendSuccess(res, result, result.message);
    } catch (error) {
      next(error);
    }
  };
}

export const walletController = new WalletController();
export default walletController;
