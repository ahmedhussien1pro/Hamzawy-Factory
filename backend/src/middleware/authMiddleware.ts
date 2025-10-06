import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { JwtPayload } from '../types/auth';
import { AppError } from '../utils/error';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('رمز التفويض مطلوب', 401);
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new AppError('رمز التفويض مطلوب', 401);
    }

    const decoded = verifyToken(token) as JwtPayload;
    req.user = decoded;

    next();
  } catch (err: any) {
    next(new AppError('رمز التفويض غير صالح أو منتهي الصلاحية', 401));
  }
}

// Optional: Role-based middleware
export function requireRole(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('غير مصرح بالوصول', 403));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('ليس لديك الصلاحية للوصول إلى هذا المورد', 403));
    }

    next();
  };
}
