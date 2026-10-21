import { body, param, query } from 'express-validator';

export const checkoutValidator = [
  body('gameAccountId')
    .notEmpty()
    .withMessage('gameAccountId is required')
    .isNumeric()
    .withMessage('gameAccountId must be a valid numeric ID'),

  body('couponCode')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 50 })
    .withMessage('Coupon code must not exceed 50 characters'),

  body('warrantyType')
    .optional()
    .isIn(['24h', '7d', '30d', 'lifetime'])
    .withMessage('Warranty type must be 24h, 7d, 30d, or lifetime'),
];

export const orderNumberParamValidator = [
  param('orderNumber')
    .trim()
    .notEmpty()
    .withMessage('orderNumber is required')
    .matches(/^ORD-[A-Z0-9-]+$/)
    .withMessage('Invalid order number format'),
];

export const queryOrdersValidator = [
  query('role')
    .optional()
    .isIn(['buyer', 'seller'])
    .withMessage('Role filter must be "buyer" or "seller"'),

  query('status')
    .optional()
    .isIn(['pending', 'paid', 'in_escrow', 'completed', 'disputed', 'refunded', 'cancelled'])
    .withMessage('Invalid order status filter'),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
];
