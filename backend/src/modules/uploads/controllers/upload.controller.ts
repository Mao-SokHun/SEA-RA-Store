import { Request, Response, NextFunction } from 'express';
import { storageService } from '../../../common/services/storage.service';

export class UploadController {
  /**
   * POST /api/v1/uploads/presign
   * Get a presigned upload URL for direct S3 / Cloudflare R2 browser upload
   */
  async getPresignedUrl(req: Request, res: Response, next: NextFunction) {
    try {
      const { filename, fileType, folder } = req.body;
      const result = await storageService.generatePresignedUploadUrl({
        filename,
        fileType,
        folder,
      });

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PUT /api/v1/uploads/mock-put
   * Mock PUT receiver for local development when S3 credentials are not yet set
   */
  async mockPut(req: Request, res: Response, next: NextFunction) {
    res.status(200).json({
      success: true,
      message: 'Mock file uploaded successfully (Dev Sandbox)',
      key: req.query.key,
    });
  }
}

export const uploadController = new UploadController();
