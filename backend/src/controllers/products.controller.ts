import { Request, Response } from 'express';
import * as productService from '../services/products.service';
import { success, failure } from '../utils/response';
import {
  createProductSchema,
  updateProductSchema,
} from '../schemas/product.schema';
import { Prisma } from '@prisma/client';

export async function getAll(req: Request, res: Response) {
  try {
    const products = await productService.getProducts();
    return success(res, products);
  } catch (err: any) {
    return failure(res, err);
  }
}

export async function getById(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    if (!id) return failure(res, new Error('Missing id param'), 400);
    const product = await productService.getProductById(id);
    return success(res, product);
  } catch (err: any) {
    return failure(res, err);
  }
}

export async function create(req: Request, res: Response) {
  try {
    // validate + coercions
    const validated = createProductSchema.parse(req.body);

    // Prisma Decimal fields: pass as string (safe)
    const payload: any = {
      name: validated.name,
      sku: validated.sku || null,
      purchasePrice: String(validated.purchasePrice),
      salePrice: validated.salePrice ? String(validated.salePrice) : null,
      quantity: validated.quantity,
      unit: validated.unit || null,
      description: validated.description || null,
    };

    const product = await productService.createProduct(payload);
    return success(res, product, 'Product created');
  } catch (err: any) {
    return failure(res, err);
  }
}

export async function update(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    if (!id) return failure(res, new Error('Missing id param'), 400);

    const validated = updateProductSchema.parse(req.body);
    const payload: any = { ...validated };

    if (validated.purchasePrice !== undefined)
      payload.purchasePrice = String(validated.purchasePrice);
    if (validated.salePrice !== undefined)
      payload.salePrice = validated.salePrice
        ? String(validated.salePrice)
        : null;

    const product = await productService.updateProduct(id, payload);
    return success(res, product, 'Product updated');
  } catch (err: any) {
    return failure(res, err);
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    if (!id) return failure(res, new Error('Missing id param'), 400);
    await productService.deleteProduct(id);
    return success(res, null, 'Product deleted');
  } catch (err: any) {
    return failure(res, err);
  }
}
