import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import { config } from '../../config';
import { Prisma } from '@prisma/client';

export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void {
  // Operational, trusted error: send message to client
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      code: err.code,
      message: err.message,
      ...('errors' in err ? { errors: (err as any).errors } : {}),
      ...(config.nodeEnv === 'development' ? { stack: err.stack } : {}),
    });
    return;
  }

  // Handle known Prisma DB constraint errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const target = Array.isArray(err.meta?.target) ? err.meta.target.join(', ') : 'field';
      res.status(409).json({
        success: false,
        code: 'CONFLICT',
        message: `A record with this ${target} already exists.`,
      });
      return;
    }
    if (err.code === 'P2025') {
      res.status(404).json({
        success: false,
        code: 'NOT_FOUND',
        message: 'The requested resource was not found.',
      });
      return;
    }
    if (err.code === 'P2003') {
      res.status(400).json({
        success: false,
        code: 'BAD_REQUEST',
        message: 'Invalid related resource reference.',
      });
      return;
    }
  }

  // Programming or unknown error: don't leak details in production
  console.error('💥 UNEXPECTED ERROR:', err);

  res.status(500).json({
    success: false,
    code: 'INTERNAL_SERVER_ERROR',
    message: config.nodeEnv === 'development' ? err.message : 'Something went wrong on the server',
    ...(config.nodeEnv === 'development' ? { stack: err.stack } : {}),
  });
}
