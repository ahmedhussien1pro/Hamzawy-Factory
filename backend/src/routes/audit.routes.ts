import { Router } from 'express';
import * as controller from '../controllers/audit.controller';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authMiddleware, controller.getAll);

export default router;
