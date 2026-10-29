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
  khqr: {
    provider: string;
    merchantName: string;
    merchantCity: string;
    accountUsd: string;
    accountKhr: string;
    bakongId: string;
    bakongIdKhr: string;
    merchantId: string;
    apiToken: string;
    developerEmail: string;
    webhookSecret: string;
  };
  bakong: {
    apiKey: string;
    webhookSecret: string;
  };

  // Top-Up Provider
  topup: {
    provider: string;
    apiKey: string;
    secret: string;
    merchantId: string;
    baseUrl: string;
  };

  // S3/R2 Storage
  s3: {
    endpoint: string;
    accessKey: string;
    secretKey: string;
    bucketName: string;
    publicUrl: string;
  };

  // Email
  email: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPass: string;
    fromEmail: string;
    fromName: string;
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

  khqr: {
    provider: getEnvVar('KHQR_PROVIDER', 'mock'),
    merchantName: getEnvVar('KHQR_MERCHANT_NAME', 'MAO SOKHUN'),
    merchantCity: getEnvVar('KHQR_MERCHANT_CITY', 'Phnom Penh'),
    accountUsd: getEnvVar('KHQR_ACCOUNT_USD', '005282269'),
    accountKhr: getEnvVar('KHQR_ACCOUNT_KHR', '005282293'),
    bakongId: getEnvVar('KHQR_BAKONG_ID', 'abaakhppxxx@abaa'),
    bakongIdKhr: getEnvVar('KHQR_BAKONG_ID_KHR', 'abaakhppxxx@abaa'),
    merchantId: getEnvVar('KHQR_MERCHANT_ID', '126052614424719'),
    apiToken: getEnvVar('BAKONG_API_TOKEN', ''),
    developerEmail: getEnvVar('BAKONG_DEVELOPER_EMAIL', ''),
    webhookSecret: getEnvVar('BAKONG_WEBHOOK_SECRET', ''),
  },
  bakong: {
    apiKey: getEnvVar('BAKONG_API_TOKEN', getEnvVar('BAKONG_API_KEY', '')),
    webhookSecret: getEnvVar('BAKONG_WEBHOOK_SECRET', ''),
  },

  topup: {
    provider: getEnvVar('TOPUP_PROVIDER', 'smileone'),
    apiKey: getEnvVar('TOPUP_PROVIDER_API_KEY', ''),
    secret: getEnvVar('TOPUP_PROVIDER_SECRET', ''),
    merchantId: getEnvVar('TOPUP_PROVIDER_MERCHANT_ID', ''),
    baseUrl: getEnvVar('TOPUP_PROVIDER_BASE_URL', 'https://api.smile.one'),
  },

  s3: {
    endpoint: getEnvVar('S3_ENDPOINT', ''),
    accessKey: getEnvVar('S3_ACCESS_KEY', ''),
    secretKey: getEnvVar('S3_SECRET_KEY', ''),
    bucketName: getEnvVar('S3_BUCKET_NAME', 'game-marketplace-assets'),
    publicUrl: getEnvVar('S3_PUBLIC_URL', ''),
  },

  email: {
    smtpHost: getEnvVar('SMTP_HOST', ''),
    smtpPort: parseInt(getEnvVar('SMTP_PORT', '587'), 10),
    smtpUser: getEnvVar('SMTP_USER', ''),
    smtpPass: getEnvVar('SMTP_PASS', ''),
    fromEmail: getEnvVar('FROM_EMAIL', 'noreply@gamemarketplace.com'),
    fromName: getEnvVar('FROM_NAME', 'Game Marketplace Support'),
  },

  platform: {
    commissionRate: parseFloat(getEnvVar('PLATFORM_COMMISSION_RATE', '0.10')),
    reservationTimeoutMinutes: parseInt(getEnvVar('RESERVATION_TIMEOUT_MINUTES', '15'), 10),
  },

  frontendUrl: getEnvVar('FRONTEND_URL', 'http://localhost:3000'),
};

export { config };
export default config;
