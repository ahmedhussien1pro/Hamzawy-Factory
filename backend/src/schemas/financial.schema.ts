import { z } from 'zod';
import { TransactionType, PaymentMethod } from '@prisma/client';

export const transactionSchema = z.object({
  type: z.nativeEnum(TransactionType),
  amount: z.number().positive(),
  description: z.string(),
  date: z.date(),
});

export const paymentSchema = z.object({
  orderId: z.string().uuid().optional(),
  amount: z.number().positive(),
  method: z.nativeEnum(PaymentMethod),
  paidBy: z.string().optional(),
});
