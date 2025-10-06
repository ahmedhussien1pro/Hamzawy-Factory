import { Request, Response } from 'express';
import prisma from '../prisma/client';
import { success, failure } from '../utils/response';

export async function getAll(req: Request, res: Response) {
  try {
    const withdrawals = await prisma.manufacturingWithdrawal.findMany({
      include: { product: true, job: true, withdrawnBy: true },
    });
    return success(res, withdrawals);
  } catch (err: any) {
    return failure(res, err);
  }
}

export async function create(req: Request, res: Response) {
  try {
    const withdrawal = await prisma.manufacturingWithdrawal.create({
      data: req.body,
    });
    return success(res, withdrawal, 'Withdrawal recorded');
  } catch (err: any) {
    return failure(res, err);
  }
}
