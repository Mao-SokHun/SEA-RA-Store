import { body, param } from 'express-validator';

export const createGameValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Game title is required')
    .isLength({ max: 100 })
    .withMessage('Game title must not exceed 100 characters'),

  body('platform')
    .trim()
    .notEmpty()
    .withMessage('Platform is required (e.g. Mobile, PC, Console, Cross-platform)')
    .isLength({ max: 50 })
    .withMessage('Platform must not exceed 50 characters'),

  body('iconUrl')
    .optional({ values: 'falsy' })
    .trim()
    .isURL()
    .withMessage('Icon URL must be a valid URL'),

  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
];

export const updateGameValidator = [
  param('id')
    .notEmpty()
    .withMessage('Game ID is required')
    .isNumeric()
    .withMessage('Game ID must be a numeric ID'),

  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Game title cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Game title must not exceed 100 characters'),

  body('platform')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Platform cannot be empty')
    .isLength({ max: 50 })
    .withMessage('Platform must not exceed 50 characters'),

  body('iconUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('Icon URL must be a valid URL'),

  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
];
