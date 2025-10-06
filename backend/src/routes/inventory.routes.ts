import { Router } from 'express';
import * as inventoryController from '../controllers/inventory.controller';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authMiddleware, inventoryController.getAll);
router.post('/', authMiddleware, inventoryController.record);

export default router;
