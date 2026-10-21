import { body, param } from 'express-validator';

export const createKHQRValidator = [
  body('orderNumber')
    .trim()
    .notEmpty()
    .withMessage('orderNumber is required')
    .matches(/^ORD-[A-Z0-9-]+$/)
    .withMessage('Invalid order number format'),

  body('currency')
    .optional()
    .isIn(['USD', 'KHR'])
    .withMessage('Currency must be USD or KHR'),
];

export const payWithWalletValidator = [
  body('orderNumber')
    .trim()
    .notEmpty()
    .withMessage('orderNumber is required')
    .matches(/^ORD-[A-Z0-9-]+$/)
    .withMessage('Invalid order number format'),
];

export const paymentOrderParamValidator = [
  param('orderNumber')
    .trim()
    .notEmpty()
    .withMessage('orderNumber is required')
    .matches(/^ORD-[A-Z0-9-]+$/)
    .withMessage('Invalid order number format'),
];

export const mockPaymentValidator = [
  body('orderNumber')
    .trim()
    .notEmpty()
    .withMessage('orderNumber is required')
    .matches(/^ORD-[A-Z0-9-]+$/)
    .withMessage('Invalid order number format'),

  body('transactionId')
    .optional()
    .trim()
    .isLength({ max: 100 }),
];
