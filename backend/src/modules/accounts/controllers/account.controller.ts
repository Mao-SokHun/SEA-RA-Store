import { Request, Response, NextFunction } from 'express';
import { accountService } from '../services/account.service';
import { sendCreated, sendSuccess } from '../../../common/utils/response';

export class AccountController {
  createListing = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const sellerId = req.user!.id;
      const userRole = req.user!.role;
      const ipAddress = req.ip || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'];

      const account = await accountService.createListing(sellerId, userRole, {
        ...req.body,
        ipAddress,
        userAgent,
      });

      sendCreated(res, account, 'Account listed successfully');
    } catch (error) {
      next(error);
    }
  };

  getPublicListings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await accountService.getPublicListings(req.query);
      sendSuccess(res, result.accounts, 'Listings retrieved successfully', 200, result.meta);
    } catch (error) {
      next(error);
    }
  };

  getListingDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const viewerUserId = req.user?.id;
      const account = await accountService.getListingById(id, viewerUserId);
      sendSuccess(res, account, 'Listing details retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  getMyListings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const sellerId = req.user!.id;
      const status = req.query.status as string | undefined;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;

      const result = await accountService.getMyListings(sellerId, status, page, limit);
      sendSuccess(res, result.accounts, 'Your listings retrieved successfully', 200, result.meta);
    } catch (error) {
      next(error);
    }
  };

  updateListing = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const sellerId = req.user!.id;
      const userRole = req.user!.role;

      const updated = await accountService.updateListing(id, sellerId, userRole, req.body);
      sendSuccess(res, updated, 'Listing updated successfully');
    } catch (error) {
      next(error);
    }
  };

  deleteListing = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const sellerId = req.user!.id;
      const userRole = req.user!.role;

      const result = await accountService.deleteListing(id, sellerId, userRole);
      sendSuccess(res, null, result.message);
    } catch (error) {
      next(error);
    }
  };
}

export const accountController = new AccountController();
export default accountController;
