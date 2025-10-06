import prisma from '../prisma/client';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken, verifyToken as verifyJWTToken } from '../utils/jwt';
import { AppError } from '../utils/error';
import {
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
} from '../services/email.service';
import { generateResetToken, consumeResetToken } from '../utils/resetToken';

export async function registerUser(
  name: string,
  email: string,
  password: string
) {
  // Check if user already exists
  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ email }],
    },
  });

  if (existing) {
    throw new AppError('البريد الإلكتروني أو رقم الهاتف مستخدم بالفعل', 400);
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: 'WAREHOUSE_STAFF',
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      isLocked: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
    token,
  };
}

export async function loginUser(identifier: string, password: string) {
  // Find user by email or phone
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: identifier }, { phone: identifier }],
    },
  });

  if (!user) {
    throw new AppError('البريد الإلكتروني أو كلمة المرور غير صحيحة', 401);
  }

  if (user.isLocked) {
    throw new AppError('الحساب مغلق due to multiple failed attempts', 403);
  }

  const isValid = await comparePassword(password, user.passwordHash);

  if (!isValid) {
    // Increment failed attempts
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: user.failedLoginAttempts + 1,
        isLocked: user.failedLoginAttempts + 1 >= 5,
      },
    });

    if (updatedUser.isLocked) {
      throw new AppError('تم قفل الحساب بعد عدة محاولات فاشلة', 403);
    }

    throw new AppError('البريد الإلكتروني أو كلمة المرور غير صحيحة', 401);
  }

  // Reset failed attempts on successful login
  await prisma.user.update({
    where: { id: user.id },
    data: {
      failedLoginAttempts: 0,
      isLocked: false,
    },
  });

  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
    token,
  };
}

export async function verifyToken(token: string) {
  try {
    const decoded = verifyJWTToken(token) as any;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isLocked: true,
        createdAt: true,
      },
    });

    if (!user || user.isLocked) {
      throw new AppError('Invalid or expired token', 401);
    }

    return user;
  } catch (error) {
    throw new AppError('Invalid or expired token', 401);
  }
}

export async function forgotPassword(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, name: true, email: true },
  });

  if (!user || !user.email) {
    return {
      message:
        'إذا كان البريد الإلكتروني مسجلاً، سيتم إرسال رابط إعادة التعيين',
    };
  }

  const resetToken = generateResetToken(user.id);

  await sendPasswordResetEmail(user.email, resetToken, user.name);

  return {
    message: 'إذا كان البريد الإلكتروني مسجلاً، سيتم إرسال رابط إعادة التعيين',
  };
}

export async function resetPassword(token: string, newPassword: string) {
  const userId = consumeResetToken(token);

  const passwordHash = await hashPassword(newPassword);

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      passwordHash,
      failedLoginAttempts: 0,
      isLocked: false,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
    },
  });

  await sendPasswordChangedEmail(user.email!, user.name);

  return {
    message: 'تم إعادة تعيين كلمة المرور بنجاح',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  };
}
