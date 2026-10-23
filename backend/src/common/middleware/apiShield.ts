import { Request, Response, NextFunction } from 'express';
import { config } from '../../config';

// Allowed origins
const ALLOWED_ORIGINS = new Set([
  config.frontendUrl.replace(/\/$/, ''),
  'http://localhost:3000',
  'http://localhost:5173',
]);

// Webhook or public paths that must be exempted from browser-only checks
const EXEMPT_PATHS = [
  '/health',
  `${config.apiPrefix}/payments/webhook`,
];

/**
 * Enterprise API Shield:
 * Protects backend endpoints against direct unauthorized calls from Postman, curl,
 * headless bots, and malicious third-party CSRF websites.
 *
 * Rules:
 * 1. Webhooks & Health check are exempted (webhooks have HMAC cryptographic signatures).
 * 2. Origin Check: If Origin header is supplied, it MUST match the allowed frontend domain.
 * 3. Client Header Verification: In production or when STRICT_API_SHIELD=true, mutations
 *    (POST, PUT, PATCH, DELETE) require the official client verification header (X-App-Platform: web-nexus
 *    or X-Requested-With: XMLHttpRequest). Raw Postman/curl requests lacking this header are rejected.
 */
export function apiShield(req: Request, res: Response, next: NextFunction): void {
  const currentPath = req.path;

  // 1. Check exemptions
  if (EXEMPT_PATHS.some((exempt) => currentPath.endsWith(exempt) || currentPath === exempt)) {
    return next();
  }

  const origin = req.headers.origin;
  const referer = req.headers.referer;

  // 2. Validate Origin if present
  if (origin) {
    const normalizedOrigin = origin.replace(/\/$/, '');
    if (!ALLOWED_ORIGINS.has(normalizedOrigin)) {
      res.status(403).json({
        success: false,
        code: 'FORBIDDEN_ORIGIN',
        message: 'Direct API access from untrusted origin is prohibited.',
      });
      return;
    }
  }

  // 3. Strict Client Verification for state-changing operations
  const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method);
  const isStrictShield = config.nodeEnv === 'production' || process.env.STRICT_API_SHIELD === 'true';

  if (isMutation && isStrictShield) {
    const clientHeader = req.headers['x-app-platform'] || req.headers['x-requested-with'];
    const hasValidClientHeader =
      clientHeader === 'web-nexus' ||
      clientHeader === 'XMLHttpRequest' ||
      (typeof clientHeader === 'string' && clientHeader.toLowerCase() === 'web-nexus');

    // If request has neither valid origin nor client verification header, reject Postman/curl request
    if (!hasValidClientHeader && !origin) {
      res.status(403).json({
        success: false,
        code: 'FORBIDDEN_CLIENT',
        message: 'Direct API access blocked. Requests must originate from the official platform web application.',
      });
      return;
    }
  }

  return next();
}
