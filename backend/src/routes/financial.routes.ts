import { Router } from 'express';
import * as financialController from '../controllers/financial.controller';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get(
  '/transactions',
  authMiddleware,
  financialController.getTransactions
);
router.post(
  '/transactions',
  authMiddleware,
  financialController.recordTransaction
);

router.get('/payments', authMiddleware, financialController.getPayments);
router.post('/payments', authMiddleware, financialController.recordPayment);

export default router;
