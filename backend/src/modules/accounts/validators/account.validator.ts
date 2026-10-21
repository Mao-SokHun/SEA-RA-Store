import { body, query, param } from 'express-validator';

export const createAccountValidator = [
  body('gameId')
    .notEmpty()
    .withMessage('gameId is required')
    .isNumeric()
    .withMessage('gameId must be a numeric ID'),

  body('title')
    .trim()
    .notEmpty()
    .withMessage('Listing title is required')
    .isLength({ min: 5, max: 150 })
    .withMessage('Title must be between 5 and 150 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Description must not exceed 5000 characters'),

  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0.5, max: 100000 })
    .withMessage('Price must be between $0.50 and $100,000'),

  body('serverRegion')
    .trim()
    .notEmpty()
    .withMessage('Server region is required (e.g. Asia, Cambodia, Global, NA, EU)')
    .isLength({ max: 50 })
    .withMessage('Server region must not exceed 50 characters'),

  body('rankLevel')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 50 })
    .withMessage('Rank level must not exceed 50 characters'),

  body('deliveryType')
    .optional()
    .isIn(['instant', 'manual'])
    .withMessage('Delivery type must be "instant" or "manual"'),

  // Account Binds Array
  body('binds')
    .optional()
    .isArray()
    .withMessage('Binds must be an array of account bind information'),

  body('binds.*.bindProvider')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Bind provider is required (e.g. Moonton, Google, Facebook)'),

  body('binds.*.bindStatus')
    .optional()
    .isIn(['clean', 'bound_changeable', 'bound_unchangeable'])
    .withMessage('Bind status must be clean, bound_changeable, or bound_unchangeable'),

  // Account Images Array
  body('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array of image URLs'),

  body('images.*.imageUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('Each image must be a valid URL'),

  // Zero-Knowledge Credentials Vault (Encrypted before storage)
  body('credentials')
    .notEmpty()
    .withMessage('Account credentials are required for escrow / automated delivery'),

  body('credentials.loginIdentifier')
    .trim()
    .notEmpty()
    .withMessage('Login email or identifier is required'),

  body('credentials.loginPassword')
    .notEmpty()
    .withMessage('Login password is required'),

  body('credentials.backupCodes')
    .optional()
    .isString(),

  body('credentials.extraInstructions')
    .optional()
    .isString()
    .isLength({ max: 2000 })
    .withMessage('Extra instructions must not exceed 2000 characters'),
];

export const updateAccountValidator = [
  param('id')
    .notEmpty()
    .isNumeric()
    .withMessage('Listing ID must be a numeric ID'),

  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 150 })
    .withMessage('Title must be between 5 and 150 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 5000 }),

  body('price')
    .optional()
    .isFloat({ min: 0.5, max: 100000 })
    .withMessage('Price must be between $0.50 and $100,000'),

  body('serverRegion')
    .optional()
    .trim()
    .isLength({ max: 50 }),

  body('rankLevel')
    .optional()
    .trim()
    .isLength({ max: 50 }),
];

export const queryAccountValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  query('gameId')
    .optional()
    .isNumeric()
    .withMessage('gameId must be a number'),

  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('minPrice must be a positive number'),

  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('maxPrice must be a positive number'),

  query('sort')
    .optional()
    .isIn(['newest', 'oldest', 'price_asc', 'price_desc', 'popular'])
    .withMessage('Invalid sort parameter'),
];
