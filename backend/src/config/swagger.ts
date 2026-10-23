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
    paths: {
      '/health': {
        get: {
          tags: ['Health'],
          summary: 'System health check and database connection status',
          responses: {
            200: { description: 'System healthy and database connected' },
            503: { description: 'Database disconnected or degraded' },
          },
        },
      },
      '/api/v1': {
        get: {
          tags: ['API Discovery'],
          summary: 'Root API directory and available module routes',
          responses: {
            200: { description: 'API routes and service directory' },
          },
        },
      },
      '/api/v1/auth/register': {
        post: {
          tags: ['Authentication'],
          summary: 'Register a new user account (buyer or seller)',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['username', 'email', 'password'],
                  properties: {
                    username: { type: 'string', example: 'pro_gamer' },
                    email: { type: 'string', example: 'gamer@example.com' },
                    password: { type: 'string', example: 'SecurePassword123!' },
                    role: { type: 'string', enum: ['buyer', 'seller'], default: 'buyer' },
                    referralCode: { type: 'string', example: 'VIP-2026' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'User successfully registered' },
            400: { description: 'Validation error' },
            409: { description: 'Email or username already exists' },
          },
        },
      },
      '/api/v1/auth/login': {
        post: {
          tags: ['Authentication'],
          summary: 'Log in with email and password',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', example: 'gamer@example.com' },
                    password: { type: 'string', example: 'SecurePassword123!' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Login successful' },
            401: { description: 'Invalid credentials or account locked' },
          },
        },
      },
      '/api/v1/auth/refresh-token': {
        post: {
          tags: ['Authentication'],
          summary: 'Rotate and refresh JWT access & refresh tokens',
          requestBody: {
            required: false,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    refreshToken: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Tokens rotated successfully' },
            401: { description: 'Invalid, expired, or reused refresh token' },
          },
        },
      },
      '/api/v1/auth/me': {
        get: {
          tags: ['Authentication'],
          summary: 'Get current user profile & wallet',
          security: [{ BearerAuth: [] }],
          responses: {
            200: { description: 'User profile retrieved' },
            401: { description: 'Unauthorized' },
          },
        },
      },
      '/api/v1/games': {
        get: {
          tags: ['Games Catalog'],
          summary: 'List supported games catalog',
          responses: {
            200: { description: 'List of games' },
          },
        },
      },
      '/api/v1/accounts': {
        get: {
          tags: ['Account Listings'],
          summary: 'Filter and paginate gaming account listings',
          parameters: [
            { in: 'query', name: 'gameId', schema: { type: 'string' } },
            { in: 'query', name: 'minPrice', schema: { type: 'number' } },
            { in: 'query', name: 'maxPrice', schema: { type: 'number' } },
            { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
            { in: 'query', name: 'limit', schema: { type: 'integer', default: 20 } },
          ],
          responses: {
            200: { description: 'Paginated account listings' },
          },
        },
        post: {
          tags: ['Account Listings'],
          summary: 'Create and list a gaming account with AES-256 encrypted vault credentials',
          security: [{ BearerAuth: [] }],
          responses: {
            201: { description: 'Account listing created' },
          },
        },
      },
      '/api/v1/accounts/{id}': {
        get: {
          tags: ['Account Listings'],
          summary: 'Get public details of an account listing',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Account details without secret credentials' },
            404: { description: 'Account not found' },
          },
        },
      },
      '/api/v1/orders/checkout': {
        post: {
          tags: ['Orders & Escrow'],
          summary: 'Reserve gaming account with 15-minute concurrency lock and create pending order',
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['gameAccountId'],
                  properties: {
                    gameAccountId: { type: 'string' },
                    couponCode: { type: 'string' },
                    warrantyDurationDays: { type: 'integer', default: 7 },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Order created with 15-minute lock' },
            409: { description: 'Account already reserved or sold' },
          },
        },
      },
      '/api/v1/orders/{orderNumber}/credentials': {
        get: {
          tags: ['Orders & Escrow'],
          summary: 'Zero-Knowledge Credential Vault delivery (buyer access only after escrow payment)',
          security: [{ BearerAuth: [] }],
          parameters: [{ in: 'path', name: 'orderNumber', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Decrypted plaintext credentials' },
            403: { description: 'Unauthorized or unpaid order' },
          },
        },
      },
      '/api/v1/orders/{orderNumber}/confirm-received': {
        post: {
          tags: ['Orders & Escrow'],
          summary: 'Confirm order receipt, mark completed, deduct 10% platform commission, and payout seller',
          security: [{ BearerAuth: [] }],
          parameters: [{ in: 'path', name: 'orderNumber', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Order completed and funds settled' },
          },
        },
      },
      '/api/v1/payments/wallet': {
        post: {
          tags: ['Payments'],
          summary: 'Pay for pending order using digital wallet balance',
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['orderNumber'],
                  properties: {
                    orderNumber: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Payment successful, funds held in escrow' },
            400: { description: 'Insufficient balance or invalid order' },
          },
        },
      },
      '/api/v1/payments/khqr': {
        post: {
          tags: ['Payments'],
          summary: 'Generate Bakong KHQR dynamic EMVCo QR code for order',
          security: [{ BearerAuth: [] }],
          responses: {
            200: { description: 'KHQR code and Base64 image' },
          },
        },
      },
      '/api/v1/wallet': {
        get: {
          tags: ['Wallet'],
          summary: 'Get user digital wallet balance',
          security: [{ BearerAuth: [] }],
          responses: {
            200: { description: 'Wallet balance and currency' },
          },
        },
      },
      '/api/v1/wallet/topup': {
        post: {
          tags: ['Wallet'],
          summary: 'Deposit funds / top-up wallet balance',
          security: [{ BearerAuth: [] }],
          responses: {
            200: { description: 'Wallet credited successfully' },
          },
        },
      },
      '/api/v1/wallet/withdraw': {
        post: {
          tags: ['Wallet'],
          summary: 'Submit bank withdrawal request',
          security: [{ BearerAuth: [] }],
          responses: {
            201: { description: 'Withdrawal request created' },
          },
        },
      },
      '/api/v1/chat/messages': {
        post: {
          tags: ['Chat & Escrow Room'],
          summary: 'Send message in order escrow room',
          security: [{ BearerAuth: [] }],
          responses: {
            201: { description: 'Message sent and broadcasted' },
          },
        },
      },
      '/api/v1/disputes': {
        post: {
          tags: ['Disputes'],
          summary: 'Raise dispute for order in escrow (freezes escrow)',
          security: [{ BearerAuth: [] }],
          responses: {
            201: { description: 'Dispute opened and escrow frozen' },
          },
        },
      },
      '/api/v1/admin/analytics/overview': {
        get: {
          tags: ['Admin Concierge'],
          summary: 'Platform volume, commission revenue, orders, and dispute stats',
          security: [{ BearerAuth: [] }],
          responses: {
            200: { description: 'Platform financial metrics' },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
export default swaggerSpec;
