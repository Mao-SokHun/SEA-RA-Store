import { body, param } from 'express-validator';

export const verifyPlayerValidator = [
  body('gameId')
    .notEmpty()
    .withMessage('gameId is required')
    .isNumeric()
    .withMessage('gameId must be a numeric ID'),

  body('playerId')
    .trim()
    .notEmpty()
    .withMessage('playerId is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('playerId must be between 1 and 100 characters'),

  body('zoneId')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 50 })
    .withMessage('zoneId must not exceed 50 characters'),

  body('serverRegion')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 50 })
    .withMessage('serverRegion must not exceed 50 characters'),
];

export const createTopUpOrderValidator = [
  body('gameId')
    .notEmpty()
    .withMessage('gameId is required')
    .isNumeric()
    .withMessage('gameId must be a numeric ID'),

  body('packageId')
    .notEmpty()
    .withMessage('packageId is required')
    .isNumeric()
    .withMessage('packageId must be a numeric ID'),

  body('playerId')
    .trim()
    .notEmpty()
    .withMessage('playerId is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('playerId must be between 1 and 100 characters'),

  body('paymentMethod')
    .notEmpty()
    .withMessage('paymentMethod is required')
    .isIn(['bakong_khqr', 'wallet'])
    .withMessage('paymentMethod must be "bakong_khqr" or "wallet"'),

  body('zoneId')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 50 })
    .withMessage('zoneId must not exceed 50 characters'),

  body('serverRegion')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 50 })
    .withMessage('serverRegion must not exceed 50 characters'),

  body('playerNickname')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 100 })
    .withMessage('playerNickname must not exceed 100 characters'),

  body('contactPhone')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 30 })
    .withMessage('contactPhone must not exceed 30 characters'),

  body('contactEmail')
    .optional({ values: 'falsy' })
    .trim()
    .isEmail()
    .withMessage('contactEmail must be a valid email address'),
];

export const topUpOrderParamValidator = [
  param('orderNumber')
    .trim()
    .notEmpty()
    .withMessage('orderNumber is required')
    .matches(/^TU-[A-Z0-9-]+$/)
    .withMessage('Invalid top-up order number format (must start with TU-)'),
];
