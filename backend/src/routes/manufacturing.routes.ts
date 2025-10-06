import { Router } from 'express';
import * as manufacturingController from '../controllers/manufacturing.controller';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authMiddleware, manufacturingController.getAll);
router.post('/', authMiddleware, manufacturingController.create);
router.patch(
  '/:id/status',
  authMiddleware,
  manufacturingController.updateStatus
);

export default router;
