import { Router } from 'express';
import { accountController } from '../controllers/account.controller';
import { validate } from '../../../common/middleware/validate';
import { authenticate, optionalAuth } from '../../../common/middleware/auth';
import {
  createAccountValidator,
  updateAccountValidator,
  queryAccountValidator,
} from '../validators/account.validator';

const router = Router();

/**
 * @route   GET /api/v1/accounts
 * @desc    Search & browse available game accounts
 * @access  Public
 */
router.get('/', queryAccountValidator, validate, accountController.getPublicListings);

/**
 * @route   GET /api/v1/accounts/my-listings
 * @desc    Get all listings created by the authenticated seller
 * @access  Private
 */
router.get('/my-listings', authenticate, accountController.getMyListings);

/**
 * @route   GET /api/v1/accounts/:id
 * @desc    Get single game account listing details
 * @access  Public (Optional Auth for owner detection)
 */
router.get('/:id', optionalAuth, accountController.getListingDetails);

/**
 * @route   POST /api/v1/accounts
 * @desc    Create a new game account listing with Zero-Knowledge Vault credentials
 * @access  Private (Authenticated Sellers / Buyers)
 */
router.post('/', authenticate, createAccountValidator, validate, accountController.createListing);

/**
 * @route   PATCH /api/v1/accounts/:id
 * @desc    Update listing details (only if available)
 * @access  Private (Owner / Admin)
 */
router.patch('/:id', authenticate, updateAccountValidator, validate, accountController.updateListing);

/**
 * @route   DELETE /api/v1/accounts/:id
 * @desc    Delete or withdraw listing
 * @access  Private (Owner / Admin)
 */
router.delete('/:id', authenticate, accountController.deleteListing);

export default router;
