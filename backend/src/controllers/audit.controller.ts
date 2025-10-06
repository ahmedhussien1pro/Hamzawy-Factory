import { Request, Response } from 'express';
import prisma from '../prisma/client';
import { success, failure } from '../utils/response';

export async function getAll(req: Request, res: Response) {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return success(res, logs);
  } catch (err: any) {
    return failure(res, err);
  }
}
