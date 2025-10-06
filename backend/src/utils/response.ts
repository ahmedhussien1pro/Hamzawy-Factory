import { Response } from 'express';

export function success(res: Response, data: any, message = 'Success') {
  return res.json({ success: true, message, data });
}

export function failure(res: Response, error: any, status = 400) {
  return res
    .status(status)
    .json({ success: false, error: error.message || error });
}
