// src/controllers/bom.controller.ts
import { Request, Response } from 'express';
import * as bomService from '../services/bom.service';
import { success, failure } from '../utils/response';
import {
  bomCreateSchema,
  bomUpdateSchema,
  computeSchema,
} from '../schemas/bom.schema';

export async function getAll(req: Request, res: Response) {
  try {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 50;
    const status = (req.query.status as string) || undefined;
    const search = (req.query.search as string) || undefined;

    const result =
      (await (bomService as any).getAll?.({ page, limit, status, search })) ??
      null;

    if (!result) {
      return success(res, { items: [], total: 0, page, limit });
    }

    return success(res, result);
  } catch (err: any) {
    return failure(res, err);
  }
}

export async function getById(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const bom = await (bomService as any).getById?.(id);

    if (!bom) {
      return failure(res, new Error('BOM not found'));
    }
    return success(res, bom);
  } catch (err: any) {
    return failure(res, err);
  }
}

export async function create(req: Request, res: Response) {
  try {
    const validated = await bomCreateSchema.validateAsync(req.body, {
      abortEarly: false,
      convert: true,
    });

    const created = await (bomService as any).create?.(validated);
    return success(res, created, 'BOM created successfully');
  } catch (err: any) {
    if (err?.isJoi) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        details: err.details,
      });
    }
    return failure(res, err);
  }
}

export async function update(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const validated = await bomUpdateSchema.validateAsync(req.body, {
      abortEarly: false,
      convert: true,
    });

    const updated = await (bomService as any).update?.(id, validated);
    return success(res, updated, 'BOM updated successfully');
  } catch (err: any) {
    if (err?.isJoi) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        details: err.details,
      });
    }
    return failure(res, err);
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const removed = await (bomService as any).remove?.(id);
    return success(res, removed, 'BOM deleted successfully');
  } catch (err: any) {
    return failure(res, err);
  }
}

export async function compute(req: Request, res: Response) {
  try {
    const bomId = req.params.id;
    if (!bomId || typeof bomId !== 'string') {
      return res
        .status(400)
        .json({ success: false, message: 'BOM id is required' });
    }

    const validated = await computeSchema.validateAsync(req.body, {
      abortEarly: false,
      convert: true,
    });
    const params = validated.params ?? {};

    const result = await bomService.computeBOM(bomId, params);

    return success(res, result);
  } catch (err: any) {
    if (err?.isJoi) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        details: err.details,
      });
    }
    return failure(res, err);
  }
}

export default {
  getAll,
  getById,
  create,
  update,
  remove,
  compute,
};
