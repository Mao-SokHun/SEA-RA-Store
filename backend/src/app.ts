import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { config } from './config';
import { prisma } from './config/database';
import { errorHandler } from './common/middleware/errorHandler';
import { notFoundHandler } from './common/middleware/notFoundHandler';
import { sendSuccess } from './common/utils/response';
import authRoutes from './modules/auth/routes/auth.routes';
import gameRoutes from './modules/accounts/routes/game.routes';
import accountRoutes from './modules/accounts/routes/account.routes';
import orderRoutes from './modules/orders/routes/order.routes';
import './common/utils/json'; // Setup BigInt toJSON serialization

export function createApp(): Application {
  const app: Application = express();

  // Trust proxy for reverse proxy setups (Nginx, Cloudflare)
  app.set('trust proxy', 1);

  // Security Middlewares
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );

  app.use(
    cors({
      origin: [config.frontendUrl, 'http://localhost:3000', 'http://localhost:5173'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
  );

  // Body Parsing Middlewares
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());
  app.use(compression());

  // Logging
  if (config.nodeEnv !== 'test') {
    app.use(morgan(config.nodeEnv === 'development' ? 'dev' : 'combined'));
  }

  // Health Check Endpoint
  app.get('/health', async (req: Request, res: Response) => {
    try {
      // Test DB connection
      await prisma.$queryRaw`SELECT 1`;
      return sendSuccess(res, {
        status: 'ok',
        database: 'connected (Neon PostgreSQL)',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: config.nodeEnv,
      }, 'System is healthy');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown database error';
      return res.status(503).json({
        success: false,
        status: 'degraded',
        database: 'disconnected',
        error: errorMessage,
      });
    }
  });

  // Base API Info Route
  app.get(config.apiPrefix, (req: Request, res: Response) => {
    return sendSuccess(res, {
      name: 'Game Account Marketplace API',
      version: '1.0.0',
      description: 'Production-ready Backend API for Game Account Trading Platform',
      endpoints: {
        health: '/health',
        auth: `${config.apiPrefix}/auth`,
        accounts: `${config.apiPrefix}/accounts`,
        orders: `${config.apiPrefix}/orders`,
        wallet: `${config.apiPrefix}/wallet`,
        games: `${config.apiPrefix}/games`,
      },
    }, 'Welcome to Game Account Marketplace API');
  });

  // API Routes
  app.use(`${config.apiPrefix}/auth`, authRoutes);
  app.use(`${config.apiPrefix}/games`, gameRoutes);
  app.use(`${config.apiPrefix}/accounts`, accountRoutes);
  app.use(`${config.apiPrefix}/orders`, orderRoutes);

  // 404 Handler
  app.use(notFoundHandler);

  // Global Centralized Error Handler
  app.use(errorHandler);

  return app;
}

export default createApp;
