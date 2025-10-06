import { Request, Response } from 'express';
import * as userService from '../services/users.service';
import { success, failure } from '../utils/response';

export async function getAll(req: Request, res: Response) {
  try {
    const users = await userService.getUsers();
    return success(res, users);
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

    const user = await userService.getUserById(id);
    return success(res, user);
  } catch (err: any) {
    return failure(res, err);
  }
}

export async function create(req: Request, res: Response) {
  try {
    const user = await userService.createUser(req.body);
    return success(res, user, 'User created');
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

    const user = await userService.updateUser(id, req.body);
    return success(res, user, 'User updated');
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

    await userService.deleteUser(id);
    return success(res, null, 'User deleted');
  } catch (err: any) {
    return failure(res, err);
  }
}
