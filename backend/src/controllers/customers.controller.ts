import { Request, Response } from 'express';
import prisma from '../prisma/client';
import { success, failure } from '../utils/response';

export async function getAll(req: Request, res: Response) {
  try {
    const customers = await prisma.customer.findMany({
      include: { orders: true },
    });
    return success(res, customers);
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
    const customer = await prisma.customer.findUnique({ where: { id: reqId } });
    return success(res, customer);
  } catch (err: any) {
    return failure(res, err);
  }
}

export async function create(req: Request, res: Response) {
  try {
    const customer = await prisma.customer.create({ data: req.body });
    return success(res, customer, 'Customer created');
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
    const customer = await prisma.customer.update({
      where: { id: reqId },
      data: req.body,
    });
    return success(res, customer, 'Customer updated');
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
    await prisma.customer.delete({ where: { id: reqId } });
    return success(res, null, 'Customer deleted');
  } catch (err: any) {
    return failure(res, err);
  }
}
