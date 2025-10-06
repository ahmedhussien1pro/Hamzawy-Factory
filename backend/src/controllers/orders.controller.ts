import { Request, Response } from 'express';
import * as orderService from '../services/orders.service';
import { success, failure } from '../utils/response';

export async function getAll(req: Request, res: Response) {
  try {
    const orders = await orderService.getOrders();
    return success(res, orders);
  } catch (err: any) {
    return failure(res, err);
  }
}

export async function create(req: Request, res: Response) {
  try {
    const order = await orderService.createOrder(req.body);
    return success(res, order, 'Order created');
  } catch (err: any) {
    return failure(res, err);
  }
}

export async function updateStatus(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    if (!id) {
      return failure(res, new Error('Missing id param'), 400);
    }

    const order = await orderService.updateOrderStatus(id, req.body.status);
    return success(res, order, 'Order status updated');
  } catch (err: any) {
    return failure(res, err);
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    if (!id) {
      return failure(res, new Error('Missing id param'), 400);
    }

    await orderService.deleteOrder(id);
    return success(res, null, 'Order deleted');
  } catch (err: any) {
    return failure(res, err);
  }
}
