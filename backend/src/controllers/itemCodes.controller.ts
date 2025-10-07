import { Request, Response } from 'express';
import prisma from '../prisma/client';
import { success, failure } from '../utils/response';

export async function getAll(req: Request, res: Response) {
  try {
    const codes = await prisma.itemCode.findMany({
      include: { products: true },
    });
    return success(res, codes);
  } catch (err: any) {
    return failure(res, err);
  }
}

export async function getById(req: Request, res: Response) {
  try {
    const reqId = req.params.id as string;
    if (!reqId) return failure(res, new Error('Missing id param'), 400);

    const code = await prisma.itemCode.findUnique({ where: { id: reqId } });
    return success(res, code);
  } catch (err: any) {
    return failure(res, err);
  }
}

export async function create(req: Request, res: Response) {
  try {
    const { code, name, minQuantity, notes } = req.body;

    const newCode = await prisma.itemCode.create({
      data: {
        code,
        name,
        notes,
        minQuantity: minQuantity ? parseInt(minQuantity) : 0, // ✅ تأكدنا إنه رقم
      },
    });

    return success(res, newCode, 'ItemCode created');
  } catch (err: any) {
    console.error('Create Error:', err);
    return failure(res, err);
  }
}

export async function update(req: Request, res: Response) {
  try {
    const reqId = req.params.id as string;
    if (!reqId) return failure(res, new Error('Missing id param'), 400);

    const { code, name, minQuantity, notes } = req.body;

    const updated = await prisma.itemCode.update({
      where: { id: reqId },
      data: {
        code,
        name,
        notes,
        minQuantity: minQuantity ? parseInt(minQuantity) : 0,
      },
    });

    return success(res, updated, 'ItemCode updated');
  } catch (err: any) {
    console.error('Update Error:', err);
    return failure(res, err);
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const reqId = req.params.id as string;
    if (!reqId) return failure(res, new Error('Missing id param'), 400);

    await prisma.itemCode.delete({ where: { id: reqId } });
    return success(res, null, 'ItemCode deleted');
  } catch (err: any) {
    return failure(res, err);
  }
}
