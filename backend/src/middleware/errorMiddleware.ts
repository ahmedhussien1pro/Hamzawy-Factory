import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/error';
import { failure } from '../utils/response';

// Centralized error handler
export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('❌ ErrorHandler:', err);

  if (err instanceof AppError) {
    return failure(res, err, err.statusCode);
  }

  return res.status(500).json({
    success: false,
    error: 'Internal Server Error',
  });
}
