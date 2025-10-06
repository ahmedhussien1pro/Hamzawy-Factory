import { Request, Response } from 'express';
import * as manufacturingService from '../services/manufacturing.service';
import { success, failure } from '../utils/response';

export async function create(req: Request, res: Response) {
  try {
    const job = await manufacturingService.createJob(req.body);
    return success(res, job, 'Manufacturing job created');
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

    const job = await manufacturingService.updateJobStatus(id, req.body.status);
    return success(res, job, 'Job status updated');
  } catch (err: any) {
    return failure(res, err);
  }
}

export async function getAll(req: Request, res: Response) {
  try {
    const jobs = await manufacturingService.getJobs();
    return success(res, jobs);
  } catch (err: any) {
    return failure(res, err);
  }
}
