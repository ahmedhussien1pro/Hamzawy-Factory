import { Router } from 'express';
import * as controller from '../controllers/withdrawals.controller';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authMiddleware, controller.getAll);
router.post('/', authMiddleware, controller.create);

export default router;
