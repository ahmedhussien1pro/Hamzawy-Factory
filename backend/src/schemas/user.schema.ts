import { z } from 'zod';
import { UserRole } from '@prisma/client';

export const createUserSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(6),
  role: z.nativeEnum(UserRole).optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(3).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  role: z.nativeEnum(UserRole).optional(),
  isLocked: z.boolean().optional(),
});
