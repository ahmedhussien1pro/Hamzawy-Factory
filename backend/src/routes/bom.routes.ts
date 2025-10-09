// src/routes/bom.routes.ts
import { Router } from 'express';
import * as bomController from '../controllers/bom.controller';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authMiddleware, bomController.getAll);
router.get('/:id', authMiddleware, bomController.getById);
router.post('/', authMiddleware, bomController.create);
router.put('/:id', authMiddleware, bomController.update);
router.delete('/:id', authMiddleware, bomController.remove);
router.post('/:id/compute', authMiddleware, bomController.compute);

export default router;
