import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

// Ensure .env is loaded
dotenv.config({ path: path.join(__dirname, '../../.env') });

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL or DIRECT_URL is not defined in environment variables');
}

// Global singleton pattern for PrismaClient
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

const pool =
  globalForPrisma.pool ??
  new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 20,
    idleTimeoutMillis: 60000,
    connectionTimeoutMillis: 30000,
  });

const adapter = new PrismaPg(pool);

const basePrisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

// Wrap $transaction to apply robust defaults for cloud serverless PostgreSQL
const originalTransaction = basePrisma.$transaction.bind(basePrisma);
(basePrisma as any).$transaction = (arg: any, options?: any) => {
  if (typeof arg === 'function') {
    const defaultOptions = {
      maxWait: 10000, // 10s to acquire connection
      timeout: 25000, // 25s timeout for interactive transaction operations
      ...options,
    };
    return originalTransaction(arg, defaultOptions);
  }
  return originalTransaction(arg, options);
};

export const prisma = basePrisma;

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pool = pool;
}

export default prisma;
