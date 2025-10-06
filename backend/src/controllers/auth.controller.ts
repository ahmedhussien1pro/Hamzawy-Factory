import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { success, failure } from '../utils/response';

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return failure(res, new Error('جميع الحقول مطلوبة'), 400);
    }

    const result = await authService.registerUser(name, email, password);
    return success(res, result, 'تم إنشاء الحساب بنجاح');
  } catch (err: any) {
    return failure(res, err, err.statusCode || 400);
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return failure(
        res,
        new Error('البريد الإلكتروني/الهاتف وكلمة المرور مطلوبان'),
        400
      );
    }

    const result = await authService.loginUser(identifier, password);
    return success(res, result, 'تم تسجيل الدخول بنجاح');
  } catch (err: any) {
    return failure(res, err, err.statusCode || 400);
  }
}

export async function verify(req: Request, res: Response) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return failure(res, new Error('Token is required'), 401);
    }

    const user = await authService.verifyToken(token);
    return success(res, { user }, 'Token is valid');
  } catch (err: any) {
    return failure(res, err, err.statusCode || 401);
  }
}

export async function forgotPassword(req: Request, res: Response) {
  try {
    const { email } = req.body;

    if (!email) {
      return failure(res, new Error('البريد الإلكتروني مطلوب'), 400);
    }

    const result = await authService.forgotPassword(email);
    return success(res, result, 'تم إرسال رابط إعادة التعيين');
  } catch (err: any) {
    return failure(res, err, err.statusCode || 400);
  }
}

export async function resetPassword(req: Request, res: Response) {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return failure(res, new Error('Token وكلمة المرور الجديدة مطلوبان'), 400);
    }

    const result = await authService.resetPassword(token, newPassword);
    return success(res, result, 'تم إعادة تعيين كلمة المرور');
  } catch (err: any) {
    return failure(res, err, err.statusCode || 400);
  }
}
