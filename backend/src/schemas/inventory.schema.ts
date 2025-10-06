import { z } from 'zod';
import { MovementType, MovementReason } from '@prisma/client';

export const inventoryMovementSchema = z.object({
  productId: z.string().uuid(),
  type: z.nativeEnum(MovementType),
  reason: z.nativeEnum(MovementReason),
  quantity: z.number().int(),
  notes: z.string().optional(),
});
