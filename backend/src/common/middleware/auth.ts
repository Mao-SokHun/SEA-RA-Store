import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError, ForbiddenError } from '../errors/AppError';
import { verifyAccessToken } from '../utils/jwt';
import { prisma } from '../../config/database';

export async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    let token: string | undefined;

    // 1. Check Authorization Header (Bearer <token>)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
    // 2. Check Cookie (accessToken)
    else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      throw new UnauthorizedError('Authentication token is missing. Please log in.');
    }

    // 3. Verify JWT
    const payload = verifyAccessToken(token);

    // 4. Verify user exists in DB and is active
    const user = await prisma.user.findUnique({
      where: { id: BigInt(payload.sub) },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        status: true,
      },
    });

    if (!user) {
      throw new UnauthorizedError('User account not found', 'USER_NOT_FOUND');
    }

    if (user.status === 'banned') {
      throw new ForbiddenError('Your account has been banned due to violation of policies', 'ACCOUNT_BANNED');
    }

    if (user.status === 'suspended') {
      throw new ForbiddenError('Your account is temporarily suspended', 'ACCOUNT_SUSPENDED');
    }

    // 5. Attach user to request
    req.user = {
      id: user.id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status,
    };

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Optional authentication middleware for endpoints accessible to both guests and members.
 * Supports Bearer header & cookies; safely ignores expired/invalid tokens so guests are not blocked.
 */
export async function optionalAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    let token: string | undefined;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return next();
    }

    const payload = verifyAccessToken(token);
    const user = await prisma.user.findUnique({
      where: { id: BigInt(payload.sub) },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        status: true,
      },
    });

    if (user && user.status === 'active') {
      req.user = {
        id: user.id.toString(),
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
      };
    }
  } catch {
    // Gracefully ignore token errors for optional auth (fallback to guest)
  }
  return next();
}

/**
 * Role-based authorization middleware
 */
export function authorize(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ForbiddenError(
          `Forbidden: You do not have sufficient permissions (${req.user.role} is not permitted for this action)`
        )
      );
    }

    next();
  };
}
