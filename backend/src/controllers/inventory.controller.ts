import { Request, Response } from 'express';
import * as inventoryService from '../services/inventory.service';
import { success, failure } from '../utils/response';

export async function record(req: Request, res: Response) {
  try {
    const movement = await inventoryService.recordMovement(req.body);
    return success(res, movement, 'Inventory movement recorded');
  } catch (err: any) {
    return failure(res, err);
  }
}

export async function getAll(req: Request, res: Response) {
  try {
    const movements = await inventoryService.getMovements();
    return success(res, movements);
  } catch (err: any) {
    return failure(res, err);
  }
}
