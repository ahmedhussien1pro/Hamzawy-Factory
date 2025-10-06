import { Request, Response } from 'express';
import * as productService from '../services/products.service';
import { success, failure } from '../utils/response';

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
    if (!id) {
      return failure(res, new Error('Missing id param'), 400);
    }

    const product = await productService.getProductById(id);
    return success(res, product);
  } catch (err: any) {
    return failure(res, err);
  }
}

export async function create(req: Request, res: Response) {
  try {
    const product = await productService.createProduct(req.body);
    return success(res, product, 'Product created');
  } catch (err: any) {
    return failure(res, err);
  }
}

export async function update(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    if (!id) {
      return failure(res, new Error('Missing id param'), 400);
    }

    const product = await productService.updateProduct(id, req.body);
    return success(res, product, 'Product updated');
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

    await productService.deleteProduct(id);
    return success(res, null, 'Product deleted');
  } catch (err: any) {
    return failure(res, err);
  }
}
