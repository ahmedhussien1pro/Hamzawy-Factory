import { Router } from 'express';
import * as productsController from '../controllers/products.controller';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/', productsController.getAll);
router.get('/:id', productsController.getById);
router.post('/', authMiddleware, productsController.create);
router.put('/:id', authMiddleware, productsController.update);
router.delete('/:id', authMiddleware, productsController.remove);

export default router;
