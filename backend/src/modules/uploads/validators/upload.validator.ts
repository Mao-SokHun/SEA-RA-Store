import { body } from 'express-validator';

export const presignUploadValidator = [
  body('filename')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Filename is required')
    .isLength({ max: 255 })
    .withMessage('Filename must not exceed 255 characters'),
  body('fileType')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('fileType (MIME type) is required')
    .isIn(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
    .withMessage('Only JPEG, PNG, WEBP, and GIF images are supported'),
  body('folder')
    .optional()
    .isString()
    .trim()
    .isIn(['accounts', 'avatars', 'disputes', 'proofs'])
    .withMessage('Folder must be one of: accounts, avatars, disputes, proofs'),
];
