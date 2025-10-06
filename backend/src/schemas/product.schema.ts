import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(2),
  sku: z.string().optional(),
  purchasePrice: z.number().nonnegative(),
  salePrice: z.number().nonnegative().optional(),
  quantity: z.number().int().nonnegative().default(0),
  unit: z.string().optional(),
  description: z.string().optional(),
});

export const updateProductSchema = createProductSchema.partial();
