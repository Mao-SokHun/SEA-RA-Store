import { Request, Response, NextFunction } from 'express';
import { config } from '../../config';

/**
 * Swagger Security Guard:
 * 1. In production, Swagger UI and OpenAPI JSON are completely disabled by default (returns 404).
 * 2. If explicitly enabled via ENABLE_SWAGGER=true in production (or for staging/internal testing),
 *    it enforces HTTP Basic Authentication (Username/Password) so unauthorized users,
 *    scanners, and attackers cannot view internal API specifications.
 */
export function swaggerGuard(req: Request, res: Response, next: NextFunction): void {
  const isProduction = process.env.NODE_ENV === 'production' || config.nodeEnv === 'production';
  const isSwaggerEnabled = process.env.ENABLE_SWAGGER === 'true';

  // 1. In production, if not explicitly enabled, block completely
  if (isProduction && !isSwaggerEnabled) {
    res.status(404).json({
      success: false,
      code: 'NOT_FOUND',
      message: 'API documentation is disabled in this environment for security.',
    });
    return;
  }

  // 2. If basic auth credentials are configured or in production with ENABLE_SWAGGER
  const swaggerUser = process.env.SWAGGER_USER || (isProduction ? 'admin' : '');
  const swaggerPass = process.env.SWAGGER_PASSWORD || (isProduction ? 'SecureNexusAdmin2026!' : '');

  // In local development without credentials configured, allow access
  if (!swaggerUser || !swaggerPass) {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Restricted Nexus API Documentation"');
    res.status(401).json({
      success: false,
      code: 'UNAUTHORIZED',
      message: 'Authentication required to view API documentation.',
    });
    return;
  }

  const base64Credentials = authHeader.split(' ')[1];
  const decoded = Buffer.from(base64Credentials, 'base64').toString('utf8');
  const [username, password] = decoded.split(':');

  if (username !== swaggerUser || password !== swaggerPass) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Restricted Nexus API Documentation"');
    res.status(401).json({
      success: false,
      code: 'UNAUTHORIZED',
      message: 'Invalid documentation credentials.',
    });
    return;
  }

  return next();
}
