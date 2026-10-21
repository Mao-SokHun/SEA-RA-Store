import crypto from 'crypto';
import { config } from '../../config';

/**
 * Hash a plain text token (e.g. refresh token, reset token) with SHA-256
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Generate a random URL-safe token (e.g. for password resets, email verification)
 */
export function generateRandomToken(bytes: number = 32): string {
  return crypto.randomBytes(bytes).toString('hex');
}

/**
 * Generate a unique referral code based on username and random alphanumeric string
 * e.g. "PROG-9X7B2"
 */
export function generateReferralCode(prefix: string = 'VIP'): string {
  const cleanPrefix = prefix.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 4) || 'GAME';
  const randomSuffix = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `${cleanPrefix}-${randomSuffix}`;
}

/**
 * AES-256-GCM Encryption
 * Used for zero-knowledge vault credentials storage (login email/password/backup codes)
 */
export function encryptAES(
  plaintext: string,
  keyHex: string = config.encryptionKey
): { iv: string; authTag: string; encryptedData: string } {
  const key = Buffer.from(keyHex, 'hex');
  const iv = crypto.randomBytes(16); // 128-bit IV for GCM
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag().toString('hex');

  return {
    iv: iv.toString('hex'),
    authTag,
    encryptedData: encrypted,
  };
}

/**
 * AES-256-GCM Decryption
 */
export function decryptAES(
  encryptedData: string,
  ivHex: string,
  authTagHex: string,
  keyHex: string = config.encryptionKey
): string {
  const key = Buffer.from(keyHex, 'hex');
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');

  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
