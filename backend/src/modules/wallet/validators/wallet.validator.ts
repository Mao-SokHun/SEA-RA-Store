import { body, param, query } from 'express-validator';

export const withdrawValidator = [
  body('amount')
    .notEmpty()
    .withMessage('Withdrawal amount is required')
    .isFloat({ min: 5.0 })
    .withMessage('Minimum withdrawal amount is $5.00'),

  body('bankName')
    .trim()
    .notEmpty()
    .withMessage('Bank name is required (e.g. ABA Bank, ACLEDA, Wing, Canadia)')
    .isLength({ max: 50 })
    .withMessage('Bank name must not exceed 50 characters'),

  body('accountNumber')
    .trim()
    .notEmpty()
    .withMessage('Bank account number is required')
    .isLength({ min: 6, max: 50 })
    .withMessage('Account number must be between 6 and 50 characters'),

  body('accountName')
    .trim()
    .notEmpty()
    .withMessage('Account recipient name is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Account recipient name must be between 3 and 100 characters'),
];

export const queryTransactionsValidator = [
  query('transactionType')
    .optional()
    .isIn(['earning', 'withdrawal', 'withdrawal_refund', 'referral_reward', 'refund', 'payment'])
    .withMessage('Invalid transaction type'),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
];

export const adminWithdrawalActionValidator = [
  param('id')
    .notEmpty()
    .withMessage('Withdrawal request ID is required')
    .isNumeric()
    .withMessage('ID must be numeric'),

  body('adminNotes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Admin notes must not exceed 500 characters'),
];

export const topupValidator = [
  body('amount')
    .notEmpty()
    .withMessage('Amount is required')
    .isFloat({ min: 1.0, max: 10000.0 })
    .withMessage('Top-up amount must be between $1.00 and $10,000.00'),
];
