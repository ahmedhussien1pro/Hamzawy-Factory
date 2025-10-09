import { z } from 'zod';

const price = z.union([z.number(), z.string()]).transform((v) => String(v));

export const createProductSchema = z.object({
  name: z.string().min(2),
  sku: z.string().optional().nullable(),
  purchasePrice: price,
  salePrice: price.optional().nullable(),
  quantity: z
    .union([z.number(), z.string()])
    .transform((v) => parseInt(String(v) || '0', 10)),
  unit: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
});

export const updateProductSchema = createProductSchema.partial();
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
