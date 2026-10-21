import dotenv from 'dotenv';
import path from 'path';

// Load .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

interface Config {
  // Server
  nodeEnv: string;
  port: number;
  apiPrefix: string;

  // Database
  databaseUrl: string;

  // Redis
  redis: {
    host: string;
    port: number;
    password: string;
  };

  // JWT
  jwt: {
    accessSecret: string;
    refreshSecret: string;
    accessExpiry: string;
    refreshExpiry: string;
  };

  // AES Encryption
  encryptionKey: string;

  // Google OAuth
  google: {
    clientId: string;
    clientSecret: string;
    callbackUrl: string;
  };

  // Telegram
  telegramBotToken: string;

  // Payment
  bakong: {
    apiKey: string;
    webhookSecret: string;
  };

  // S3/R2 Storage
  s3: {
    endpoint: string;
    accessKey: string;
    secretKey: string;
    bucketName: string;
    publicUrl: string;
  };

  // Platform
  platform: {
    commissionRate: number;
    reservationTimeoutMinutes: number;
  };

  // CORS
  frontendUrl: string;
}

function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

const config: Config = {
  nodeEnv: getEnvVar('NODE_ENV', 'development'),
  port: parseInt(getEnvVar('PORT', '5000'), 10),
  apiPrefix: getEnvVar('API_PREFIX', '/api/v1'),

  databaseUrl: getEnvVar('DATABASE_URL'),

  redis: {
    host: getEnvVar('REDIS_HOST', 'localhost'),
    port: parseInt(getEnvVar('REDIS_PORT', '6379'), 10),
    password: getEnvVar('REDIS_PASSWORD', ''),
  },

  jwt: {
    accessSecret: getEnvVar('JWT_ACCESS_SECRET'),
    refreshSecret: getEnvVar('JWT_REFRESH_SECRET'),
    accessExpiry: getEnvVar('JWT_ACCESS_EXPIRY', '15m'),
    refreshExpiry: getEnvVar('JWT_REFRESH_EXPIRY', '7d'),
  },

  encryptionKey: getEnvVar('ENCRYPTION_KEY'),

  google: {
    clientId: getEnvVar('GOOGLE_CLIENT_ID', ''),
    clientSecret: getEnvVar('GOOGLE_CLIENT_SECRET', ''),
    callbackUrl: getEnvVar('GOOGLE_CALLBACK_URL', 'http://localhost:5000/api/v1/auth/google/callback'),
  },

  telegramBotToken: getEnvVar('TELEGRAM_BOT_TOKEN', ''),

  bakong: {
    apiKey: getEnvVar('BAKONG_API_KEY', ''),
    webhookSecret: getEnvVar('BAKONG_WEBHOOK_SECRET', ''),
  },

  s3: {
    endpoint: getEnvVar('S3_ENDPOINT', ''),
    accessKey: getEnvVar('S3_ACCESS_KEY', ''),
    secretKey: getEnvVar('S3_SECRET_KEY', ''),
    bucketName: getEnvVar('S3_BUCKET_NAME', 'game-marketplace-assets'),
    publicUrl: getEnvVar('S3_PUBLIC_URL', ''),
  },

  platform: {
    commissionRate: parseFloat(getEnvVar('PLATFORM_COMMISSION_RATE', '0.10')),
    reservationTimeoutMinutes: parseInt(getEnvVar('RESERVATION_TIMEOUT_MINUTES', '15'), 10),
  },

  frontendUrl: getEnvVar('FRONTEND_URL', 'http://localhost:3000'),
};

export { config };
export default config;
