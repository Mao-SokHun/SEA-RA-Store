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
// ============================================================
// FEATURE FLAGS: Only TopUp is active. Sell Account & Rent for Fee are DISABLED.
// To re-enable, uncomment the relevant import and route below.
// ============================================================

// [DISABLED - Sell Account] import gameRoutes from './modules/accounts/routes/game.routes';
// [DISABLED - Sell Account] import accountRoutes from './modules/accounts/routes/account.routes';
// [DISABLED - Sell Account] import orderRoutes from './modules/orders/routes/order.routes';
import paymentRoutes from './modules/payments/routes/payment.routes';
import walletRoutes from './modules/wallet/routes/wallet.routes';
import chatRoutes from './modules/chat/routes/chat.routes';
// [DISABLED - Sell Account] import disputeRoutes from './modules/disputes/routes/dispute.routes';
// [DISABLED - Sell Account] import couponRoutes from './modules/coupons/routes/coupon.routes';
// [DISABLED - Sell Account] import referralRoutes from './modules/referrals/routes/referral.routes';
import userRoutes from './modules/users/routes/user.routes';
import adminRoutes from './modules/admin/routes/admin.routes';
import topUpRoutes from './modules/topup/routes/topup.routes';
import uploadRoutes from './modules/uploads/routes/upload.routes';
import notificationRoutes from './modules/notifications/routes/notification.routes';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import { generalLimiter } from './common/middleware/rateLimiter';
import { swaggerGuard } from './common/middleware/swaggerGuard';
import { payloadSanitizer } from './common/middleware/sanitizer';
import { apiShield } from './common/middleware/apiShield';
import './common/utils/json'; // Setup BigInt toJSON serialization

export function createApp(): Application {
  const app: Application = express();

  // Trust proxy for reverse proxy setups (Nginx, Cloudflare)
  app.set('trust proxy', 1);
  app.disable('x-powered-by');

  // Security Middlewares
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      hidePoweredBy: true,
      xssFilter: true,
      noSniff: true,
    })
  );

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || origin === config.frontendUrl || origin === 'http://localhost:3000' || origin === 'http://localhost:5173' || origin.endsWith('.vercel.app')) {
          callback(null, true);
        } else {
          callback(null, true);
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-App-Platform'],
    })
  );

  // Body Parsing Middlewares (Protected with size limits to prevent DoS)
  app.use(
    express.json({
      limit: '2mb',
      verify: (req: any, _res, buf) => {
        req.rawBody = buf ? buf.toString('utf8') : '';
      },
    })
  );
  app.use(express.urlencoded({ extended: true, limit: '2mb' }));
  app.use(cookieParser());
  app.use(compression());

  // Prototype Pollution & Injection Sanitizer
  app.use(payloadSanitizer);

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
        documentation: '/api/docs',
        auth: `${config.apiPrefix}/auth`,
        // [DISABLED - Sell Account] accounts: `${config.apiPrefix}/accounts`,
        // [DISABLED - Sell Account] orders: `${config.apiPrefix}/orders`,
        payments: `${config.apiPrefix}/payments`,
        wallet: `${config.apiPrefix}/wallet`,
        // [DISABLED - Sell Account] chat: `${config.apiPrefix}/chat`,
        // [DISABLED - Sell Account] disputes: `${config.apiPrefix}/disputes`,
        // [DISABLED - Sell Account] games: `${config.apiPrefix}/games`,
        // [DISABLED - Sell Account] coupons: `${config.apiPrefix}/coupons`,
        // [DISABLED - Sell Account] referrals: `${config.apiPrefix}/referrals`,
        users: `${config.apiPrefix}/users`,
        admin: `${config.apiPrefix}/admin`,
        topup: `${config.apiPrefix}/topup`,
      },
    }, 'Welcome to Game Account Marketplace API');
  });

  // Interactive Swagger API Documentation (Protected with swaggerGuard)
  app.use(
    '/api/docs',
    swaggerGuard,
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'Game Marketplace API Documentation',
    })
  );

  app.get('/api/docs.json', swaggerGuard, (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  // Enterprise API Shield (Prevents Postman / headless bot / untrusted direct attacks)
  app.use(config.apiPrefix, apiShield);

  // Rate Limiting on API
  app.use(config.apiPrefix, generalLimiter);

  // API Routes
  app.use(`${config.apiPrefix}/auth`, authRoutes);
  // [DISABLED - Sell Account] app.use(`${config.apiPrefix}/games`, gameRoutes);
  // [DISABLED - Sell Account] app.use(`${config.apiPrefix}/accounts`, accountRoutes);
  // [DISABLED - Sell Account] app.use(`${config.apiPrefix}/orders`, orderRoutes);
  app.use(`${config.apiPrefix}/payments`, paymentRoutes);
  app.use(`${config.apiPrefix}/wallet`, walletRoutes);
  app.use(`${config.apiPrefix}/chat`, chatRoutes);
  // [DISABLED - Sell Account] app.use(`${config.apiPrefix}/disputes`, disputeRoutes);
  // [DISABLED - Sell Account] app.use(`${config.apiPrefix}/coupons`, couponRoutes);
  // [DISABLED - Sell Account] app.use(`${config.apiPrefix}/referrals`, referralRoutes);
  app.use(`${config.apiPrefix}/users`, userRoutes);
  app.use(`${config.apiPrefix}/admin`, adminRoutes);
  app.use(`${config.apiPrefix}/topup`, topUpRoutes);
  app.use(`${config.apiPrefix}/uploads`, uploadRoutes);
  app.use(`${config.apiPrefix}/notifications`, notificationRoutes);

  // 404 Handler
  app.use(notFoundHandler);

  // Global Centralized Error Handler
  app.use(errorHandler);

  return app;
}

export default createApp;
