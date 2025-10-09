// src/schemas/customer.schema.ts
import { z } from 'zod';

export const createCustomerSchema = z.object({
  name: z.string().min(1, 'الاسم مطلوب'),
  phone: z.string().optional().nullable(),
  email: z.string().email('البريد غير صالح').optional().nullable(),
  address: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const updateCustomerSchema = createCustomerSchema.partial();
