import crypto from 'crypto';
import { AppError } from './error';

// تخزين مؤقت للـ reset tokens (في production استخدم Redis)
const resetTokens = new Map<string, { userId: string; expiresAt: Date }>();

export function generateResetToken(userId: string): string {
  // generate random token
  const token = crypto.randomBytes(32).toString('hex');

  // token صالح لمدة ساعة
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  // save token
  resetTokens.set(token, { userId, expiresAt });

  // clean expired tokens
  cleanupExpiredTokens();

  return token;
}

export function verifyResetToken(token: string): string {
  const tokenData = resetTokens.get(token);

  if (!tokenData) {
    throw new AppError('رمز إعادة التعيين غير صالح', 400);
  }

  if (new Date() > tokenData.expiresAt) {
    resetTokens.delete(token);
    throw new AppError('رمز إعادة التعيين منتهي الصلاحية', 400);
  }

  return tokenData.userId;
}

export function consumeResetToken(token: string): string {
  const userId = verifyResetToken(token);
  resetTokens.delete(token);
  return userId;
}

function cleanupExpiredTokens() {
  const now = new Date();
  for (const [token, data] of resetTokens.entries()) {
    if (now > data.expiresAt) {
      resetTokens.delete(token);
    }
  }
}
