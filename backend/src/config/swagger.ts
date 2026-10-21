import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './index';

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Game Account Marketplace API',
      version: '1.0.0',
      description: `
## Enterprise Game Account Trading Platform Backend
High-concurrency, zero-knowledge encrypted game account marketplace backend API.

### Core Architecture Features:
- **Zero-Knowledge Credential Vault**: AES-256-GCM encryption with unique IV/authTag per field.
- **Escrow State Machine**: Concurrency reservation locks (15m expiration) preventing double-spending.
- **Bakong KHQR Engine**: EMVCo-compliant dynamic QR generator for instant Cambodia banking checkout.
- **Atomic Wallet Ledger**: High-precision Decimal balance tracking, seller payouts, instant auto-refunds.
- **Real-Time Escrow Chat & Disputes**: WebSocket-integrated buyer/seller handover communication and dispute mediation.
      `,
      contact: {
        name: 'API Support',
        email: 'mlyhour57@gmail.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.port}`,
        description: 'Local Development Server',
      },
      {
        url: 'https://api.gameplatform.local',
        description: 'Production Server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your Access Token obtained from /api/v1/auth/login or /api/v1/auth/register',
        },
        CookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'accessToken',
          description: 'HTTP-only session cookie',
        },
      },
      schemas: {
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Operation completed successfully' },
            data: { type: 'object' },
            meta: {
              type: 'object',
              properties: {
                page: { type: 'integer', example: 1 },
                limit: { type: 'integer', example: 20 },
                total: { type: 'integer', example: 100 },
                totalPages: { type: 'integer', example: 5 },
              },
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error message description' },
            code: { type: 'string', example: 'VALIDATION_ERROR' },
            errors: { type: 'array', items: { type: 'object' } },
          },
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: [
    './src/modules/**/*.routes.ts',
    './src/modules/**/*.controller.ts',
    './src/app.ts',
  ],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
export default swaggerSpec;
