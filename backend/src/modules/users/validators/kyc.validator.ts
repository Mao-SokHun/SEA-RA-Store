import { body, param, query } from 'express-validator';

export const submitKYCValidator = [
  body('idCardNumber')
    .trim()
    .notEmpty()
    .withMessage('National ID or Passport number is required')
    .isLength({ min: 5, max: 50 })
    .withMessage('ID card number must be between 5 and 50 characters'),
  body('idCardFrontUrl')
    .trim()
    .notEmpty()
    .withMessage('Front image of ID card is required')
    .isURL({ require_tld: false })
    .withMessage('Front image must be a valid URL or uploaded image path'),
  body('idCardBackUrl')
    .trim()
    .notEmpty()
    .withMessage('Back image of ID card is required')
    .isURL({ require_tld: false })
    .withMessage('Back image must be a valid URL or uploaded image path'),
  body('selfieUrl')
    .trim()
    .notEmpty()
    .withMessage('Selfie holding ID card is required')
    .isURL({ require_tld: false })
    .withMessage('Selfie image must be a valid URL or uploaded image path'),
];

export const reviewKYCValidator = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('KYC Verification ID is required'),
  body('action')
    .trim()
    .isIn(['approve', 'reject'])
    .withMessage('Action must be either "approve" or "reject"'),
  body('rejectionReason')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Rejection reason cannot exceed 500 characters'),
];

export const listKYCQueryValidator = [
  query('status')
    .optional()
    .isIn(['pending', 'approved', 'rejected', 'all'])
    .withMessage('Status must be pending, approved, rejected, or all'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
];
