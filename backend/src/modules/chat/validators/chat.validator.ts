import { body, param, query } from 'express-validator';

export const sendMessageValidator = [
  param('orderNumber')
    .trim()
    .notEmpty()
    .withMessage('Order number is required'),

  body('content')
    .trim()
    .notEmpty()
    .withMessage('Message content cannot be empty')
    .isLength({ max: 2000 })
    .withMessage('Message content must not exceed 2000 characters'),

  body('messageType')
    .optional()
    .isIn(['text', 'image', 'system'])
    .withMessage('Invalid message type. Allowed: text, image, system'),
];

export const getChatHistoryValidator = [
  param('orderNumber')
    .trim()
    .notEmpty()
    .withMessage('Order number is required'),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
];
