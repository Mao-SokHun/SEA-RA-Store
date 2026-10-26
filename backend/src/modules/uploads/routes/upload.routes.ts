import { Router } from 'express';
import { uploadController } from '../controllers/upload.controller';
import { presignUploadValidator } from '../validators/upload.validator';
import { validate } from '../../../common/middleware/validate';
import { authenticate } from '../../../common/middleware/auth';

const router = Router();

/**
 * @swagger
 * /uploads/presign:
 *   post:
 *     summary: Generate a presigned PUT URL for direct S3 / Cloudflare R2 image upload
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  '/presign',
  authenticate,
  presignUploadValidator,
  validate,
  uploadController.getPresignedUrl.bind(uploadController)
);

// Sandbox development mock PUT endpoint
router.put('/mock-put', uploadController.mockPut.bind(uploadController));

export default router;
