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
    if (!reqId) {
      return failure(res, new Error('Missing id param'), 400);
    }
    const code = await prisma.itemCode.findUnique({
      where: { id: reqId },
    });
    return success(res, code);
  } catch (err: any) {
    return failure(res, err);
  }
}

export async function create(req: Request, res: Response) {
  try {
    const code = await prisma.itemCode.create({ data: req.body });
    return success(res, code, 'ItemCode created');
  } catch (err: any) {
    return failure(res, err);
  }
}

export async function update(req: Request, res: Response) {
  try {
    const reqId = req.params.id as string;
    if (!reqId) {
      return failure(res, new Error('Missing id param'), 400);
    }
    const code = await prisma.itemCode.update({
      where: { id: reqId },
      data: req.body,
    });
    return success(res, code, 'ItemCode updated');
  } catch (err: any) {
    return failure(res, err);
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const reqId = req.params.id as string;
    if (!reqId) {
      return failure(res, new Error('Missing id param'), 400);
    }
    await prisma.itemCode.delete({ where: { id: reqId } });
    return success(res, null, 'ItemCode deleted');
  } catch (err: any) {
    return failure(res, err);
  }
}
