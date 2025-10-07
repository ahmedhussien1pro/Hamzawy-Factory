import { Request, Response } from 'express';
import * as inventoryService from '../services/inventory.service';
import { success, failure } from '../utils/response';

export async function record(req: Request, res: Response) {
  try {
    const performedById = (req as any).user?.id || req.body.performedById;
    const payload = { ...req.body, performedById };

    const movement = await inventoryService.recordMovement(payload);
    return success(res, movement, 'Inventory movement recorded');
  } catch (err: any) {
    return failure(res, err);
  }
}

export async function getAll(req: Request, res: Response) {
  try {
    const filters = {
      productId: req.query.productId as string | undefined,
      type: req.query.type as string | undefined,
      reason: req.query.reason as string | undefined,
      from: req.query.from as string | undefined,
      to: req.query.to as string | undefined,
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 50,
    };

    // basic sanitization: cap limit
    if (filters.limit && filters.limit > 1000) filters.limit = 1000;

    const result = await inventoryService.getMovements(filters);
    // result shape: { items, total, page, limit }

    // If the request specifically asks for a single product's movements,
    // return the items array directly (simpler for frontend lists)
    if (filters.productId) {
      return success(res, result.items);
    }

    // Otherwise return the paginated wrapper
    return success(res, result);
  } catch (err: any) {
    return failure(res, err);
  }
}
