import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validate } from '../../../common/middleware/validate';
import { authenticate } from '../../../common/middleware/auth';
import { authLimiter } from '../../../common/middleware/rateLimiter';
import { preventDoubleSubmit } from '../../../common/middleware/antiDoubleSubmit';
import { body } from 'express-validator';
import {
  registerValidator,
  loginValidator,
  refreshTokenValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} from '../validators/auth.validator';

const router = Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user account
 * @access  Public
 */
router.post(
  '/register',
  preventDoubleSubmit({ windowMs: 3000, message: 'Account creation is currently processing. Please wait.' }),
  authLimiter,
  registerValidator,
  validate,
  authController.register
);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Authenticate user and get tokens
 * @access  Public
 */
router.post('/login', authLimiter, loginValidator, validate, authController.login);

/**
 * @route   POST /api/v1/auth/google
 * @desc    Authenticate with Google OAuth 2.0 ID Token
 * @access  Public
 */
router.post(
  '/google',
  authLimiter,
  preventDoubleSubmit({ windowMs: 2000 }),
  [body('idToken').trim().notEmpty().withMessage('Google ID token is required')],
  validate,
  authController.googleLogin
);

/**
 * @route   POST /api/v1/auth/refresh-token
 * @desc    Rotate and issue new access & refresh tokens
 * @access  Public (via cookie or body)
 */
router.post('/refresh-token', refreshTokenValidator, validate, authController.refreshToken);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Revoke refresh token and clear cookies
 * @access  Public / Authenticated
 */
router.post('/logout', authController.logout);

/**
 * @route   POST /api/v1/auth/forgot-password
 * @desc    Request password reset token
 * @access  Public
 */
router.post(
  '/forgot-password',
  preventDoubleSubmit({ windowMs: 3000 }),
  authLimiter,
  forgotPasswordValidator,
  validate,
  authController.forgotPassword
);

/**
 * @route   POST /api/v1/auth/reset-password
 * @desc    Reset password using reset token
 * @access  Public
 */
router.post(
  '/reset-password',
  preventDoubleSubmit({ windowMs: 3000 }),
  authLimiter,
  resetPasswordValidator,
  validate,
  authController.resetPassword
);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get currently authenticated user's profile
 * @access  Private
 */
router.get('/me', authenticate, authController.getMe);

export default router;
