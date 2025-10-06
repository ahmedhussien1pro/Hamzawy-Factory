import { Request, Response } from 'express';
import * as financialService from '../services/financial.service';
import { success, failure } from '../utils/response';

export async function recordTransaction(req: Request, res: Response) {
  try {
    const tx = await financialService.recordTransaction(req.body);
    return success(res, tx, 'Transaction recorded');
  } catch (err: any) {
    return failure(res, err);
  }
}

export async function recordPayment(req: Request, res: Response) {
  try {
    const payment = await financialService.recordPayment(req.body);
    return success(res, payment, 'Payment recorded');
  } catch (err: any) {
    return failure(res, err);
  }
}

export async function getTransactions(req: Request, res: Response) {
  try {
    const txs = await financialService.getTransactions();
    return success(res, txs);
  } catch (err: any) {
    return failure(res, err);
  }
}

export async function getPayments(req: Request, res: Response) {
  try {
    const payments = await financialService.getPayments();
    return success(res, payments);
  } catch (err: any) {
    return failure(res, err);
  }
}
