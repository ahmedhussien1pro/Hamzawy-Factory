import { Router } from 'express';
import * as ordersController from '../controllers/orders.controller';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authMiddleware, ordersController.getAll);
router.post('/', authMiddleware, ordersController.create);
router.patch('/:id/status', authMiddleware, ordersController.updateStatus);
router.delete('/:id', authMiddleware, ordersController.remove);

export default router;
