import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import { config } from '../../config';

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
      ...(config.nodeEnv === 'development' ? { stack: err.stack } : {}),
    });
    return;
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
