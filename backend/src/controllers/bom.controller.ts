import { Request, Response } from 'express';
import prisma from '../prisma/client';
import { success, failure } from '../utils/response';

export async function getAll(req: Request, res: Response) {
  try {
    const boms = await prisma.bOM.findMany({
      include: { components: true, targetProduct: true },
    });
    return success(res, boms);
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
    const bom = await prisma.bOM.findUnique({
      where: { id: reqId },
      include: { components: true, targetProduct: true },
    });
    return success(res, bom);
  } catch (err: any) {
    return failure(res, err);
  }
}

export async function create(req: Request, res: Response) {
  try {
    const bom = await prisma.bOM.create({
      data: {
        ...req.body,
        components: { create: req.body.components || [] },
      },
      include: { components: true },
    });
    return success(res, bom, 'BOM created');
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
    const bom = await prisma.bOM.update({
      where: { id: reqId },
      data: req.body,
    });
    return success(res, bom, 'BOM updated');
  } catch (err: any) {
    return failure(res, err);
  }
}

export async function remove(req: Request, res: Response) {
  const reqId = req.params.id as string;
  if (!reqId) {
    return failure(res, new Error('Missing id param'), 400);
  }
  try {
    await prisma.bOM.delete({ where: { id: reqId } });
    return success(res, null, 'BOM deleted');
  } catch (err: any) {
    return failure(res, err);
  }
}
