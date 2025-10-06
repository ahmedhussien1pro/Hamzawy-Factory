import { z } from 'zod';
import { OrderStatus } from '@prisma/client';

export const createOrderSchema = z.object({
  customerId: z.string().uuid(),
  salesRepId: z.string().uuid().optional(),
  deliveryAddress: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(
    z.object({
      productId: z.string().uuid(),
      quantity: z.number().int().positive(),
      priceSnapshot: z.number().nonnegative(),
      unitCostSnapshot: z.number().nonnegative(),
    })
  ),
});

export const updateOrderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus),
});
