import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../../config';
import { UnauthorizedError } from '../errors/AppError';

export interface JwtPayload {
  sub: string; // User ID as string
  username: string;
  email: string;
  role: string;
}

export function signAccessToken(payload: JwtPayload): string {
  const options: SignOptions = {
    expiresIn: config.jwt.accessExpiry as SignOptions['expiresIn'],
  };
  return jwt.sign(payload, config.jwt.accessSecret, options);
}

export function signRefreshToken(payload: JwtPayload): string {
  const options: SignOptions = {
    expiresIn: config.jwt.refreshExpiry as SignOptions['expiresIn'],
  };
  return jwt.sign(payload, config.jwt.refreshSecret, options);
}

export function verifyAccessToken(token: string): JwtPayload {
  try {
    return jwt.verify(token, config.jwt.accessSecret) as JwtPayload;
  } catch (err: unknown) {
    if (err instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Access token has expired', 'TOKEN_EXPIRED');
    }
    throw new UnauthorizedError('Invalid access token', 'TOKEN_INVALID');
  }
}

export function verifyRefreshToken(token: string): JwtPayload {
  try {
    return jwt.verify(token, config.jwt.refreshSecret) as JwtPayload;
  } catch (err: unknown) {
    if (err instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Refresh token has expired', 'TOKEN_EXPIRED');
    }
    throw new UnauthorizedError('Invalid refresh token', 'TOKEN_INVALID');
  }
}
