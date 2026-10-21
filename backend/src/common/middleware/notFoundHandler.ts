import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '../errors/AppError';

export function notFoundHandler(req: Request, res: Response, next: NextFunction): void {
  next(new NotFoundError(`Endpoint not found: ${req.method} ${req.originalUrl}`));
}
