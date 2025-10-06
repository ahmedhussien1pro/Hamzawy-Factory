import { z } from 'zod';
import { JobStatus } from '@prisma/client';

export const createJobSchema = z.object({
  bomId: z.string().uuid().optional(),
  targetProductId: z.string().uuid(),
  targetQuantity: z.number().int().positive(),
  notes: z.string().optional(),
});

export const updateJobStatusSchema = z.object({
  status: z.nativeEnum(JobStatus),
});
