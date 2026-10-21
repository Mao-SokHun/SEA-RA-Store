import { body, param, query } from 'express-validator';

export const createDisputeValidator = [
  param('orderNumber')
    .trim()
    .notEmpty()
    .withMessage('Order number is required'),

  body('reason')
    .trim()
    .notEmpty()
    .withMessage('Dispute reason is required')
    .isLength({ min: 5, max: 150 })
    .withMessage('Reason must be between 5 and 150 characters'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Dispute description is required')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
];

export const resolveDisputeValidator = [
  param('orderNumber')
    .trim()
    .notEmpty()
    .withMessage('Order number is required'),

  body('resolution')
    .notEmpty()
    .isIn(['refund_buyer', 'payout_seller', 'dismiss'])
    .withMessage('Resolution must be one of: refund_buyer, payout_seller, dismiss'),

  body('adminNotes')
    .trim()
    .notEmpty()
    .withMessage('Admin notes/rationale are required')
    .isLength({ min: 5, max: 1000 })
    .withMessage('Admin notes must be between 5 and 1000 characters'),
];

export const queryDisputesValidator = [
  query('status')
    .optional()
    .isIn(['open', 'under_review', 'resolved_buyer', 'resolved_seller', 'dismissed', 'cancelled'])
    .withMessage('Invalid dispute status'),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
];
