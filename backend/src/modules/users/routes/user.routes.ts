import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { authenticate } from '../../../common/middleware/auth';
import { body } from 'express-validator';
import { validate } from '../../../common/middleware/validate';
import { authLimiter } from '../../../common/middleware/rateLimiter';
import { preventDoubleSubmit } from '../../../common/middleware/antiDoubleSubmit';

const router = Router();

// All user routes require authentication
router.use(authenticate);

/**
 * @route   PATCH /api/v1/users/profile
 * @desc    Update basic user profile details
 * @access  Private
 */
router.patch(
  '/profile',
  preventDoubleSubmit({ windowMs: 2000 }),
  [
    body('phone').optional().trim().isLength({ min: 6, max: 20 }).withMessage('Phone must be 6-20 characters'),
  ],
  validate,
  userController.updateProfile
);

/**
 * @route   POST /api/v1/users/change-password
 * @desc    Change user password & invalidate existing sessions
 * @access  Private
 */
router.post(
  '/change-password',
  preventDoubleSubmit({ windowMs: 3000 }),
  authLimiter,
  [
    body('oldPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('New password must be at least 8 characters long'),
  ],
  validate,
  userController.changePassword
);

/**
 * @route   GET /api/v1/users/notifications/telegram
 * @desc    Get user's Telegram link status and notification preferences
 * @access  Private
 */
router.get('/notifications/telegram', userController.getTelegramSettings);

/**
 * @route   PATCH /api/v1/users/notifications/telegram
 * @desc    Update user's Telegram settings or link chat ID
 * @access  Private
 */
router.patch(
  '/notifications/telegram',
  preventDoubleSubmit({ windowMs: 2000 }),
  userController.updateTelegramSettings
);

export default router;
