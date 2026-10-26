import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';
import { config } from '../../config';
import { BadRequestError } from '../errors/AppError';

export interface PresignUploadDTO {
  filename: string;
  fileType: string;
  folder?: 'accounts' | 'avatars' | 'disputes' | 'proofs';
}

export interface PresignUploadResult {
  uploadUrl: string;
  fileUrl: string;
  key: string;
  expiresInSeconds: number;
}

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export class StorageService {
  private s3Client: S3Client | null = null;

  constructor() {
    if (config.s3.accessKey && config.s3.secretKey && config.s3.endpoint) {
      this.s3Client = new S3Client({
        region: 'auto', // Cloudflare R2 uses 'auto', AWS uses specific region
        endpoint: config.s3.endpoint,
        credentials: {
          accessKeyId: config.s3.accessKey,
          secretAccessKey: config.s3.secretKey,
        },
      });
    }
  }

  /**
   * Check if Cloudflare R2 / AWS S3 is fully configured
   */
  isConfigured(): boolean {
    return !!(this.s3Client && config.s3.bucketName);
  }

  /**
   * Generate a presigned PUT URL for direct browser-to-S3/R2 image upload
   */
  async generatePresignedUploadUrl(data: PresignUploadDTO): Promise<PresignUploadResult> {
    const { filename, fileType, folder = 'accounts' } = data;

    if (!ALLOWED_MIME_TYPES.includes(fileType.toLowerCase())) {
      throw new BadRequestError(
        `Invalid file type "${fileType}". Allowed formats: JPEG, PNG, WEBP, GIF.`
      );
    }

    // Clean filename and create unique S3 key
    const sanitizedName = filename.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
    const randomHex = crypto.randomBytes(4).toString('hex');
    const key = `${folder}/${Date.now()}-${randomHex}-${sanitizedName}`;

    // If S3 is not configured (e.g. in development), return a simulated URL
    if (!this.s3Client || !config.s3.bucketName) {
      const mockPublicUrl = config.s3.publicUrl || `http://localhost:${config.port}/uploads`;
      return {
        uploadUrl: `http://localhost:${config.port}/api/v1/uploads/mock-put?key=${encodeURIComponent(key)}`,
        fileUrl: `${mockPublicUrl}/${key}`,
        key,
        expiresInSeconds: 900,
      };
    }

    const command = new PutObjectCommand({
      Bucket: config.s3.bucketName,
      Key: key,
      ContentType: fileType,
    });

    const expiresInSeconds = 900; // 15 mins
    const uploadUrl = await getSignedUrl(this.s3Client, command, { expiresIn: expiresInSeconds });

    // Determine public CDN URL
    let fileUrl: string;
    if (config.s3.publicUrl) {
      fileUrl = `${config.s3.publicUrl.replace(/\/$/, '')}/${key}`;
    } else {
      fileUrl = `${config.s3.endpoint.replace(/\/$/, '')}/${config.s3.bucketName}/${key}`;
    }

    return {
      uploadUrl,
      fileUrl,
      key,
      expiresInSeconds,
    };
  }

  /**
   * Delete an object from S3 / R2 storage
   */
  async deleteFile(key: string): Promise<boolean> {
    if (!this.s3Client || !config.s3.bucketName) {
      return false;
    }

    try {
      const command = new DeleteObjectCommand({
        Bucket: config.s3.bucketName,
        Key: key,
      });
      await this.s3Client.send(command);
      return true;
    } catch (err) {
      console.error(`Failed to delete S3 file ${key}:`, err);
      return false;
    }
  }
}

export const storageService = new StorageService();
export default storageService;
