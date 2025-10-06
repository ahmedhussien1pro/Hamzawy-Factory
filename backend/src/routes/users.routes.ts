import { Router } from 'express';
import * as usersController from '../controllers/users.controller';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authMiddleware, usersController.getAll);
router.get('/:id', authMiddleware, usersController.getById);
router.post('/', authMiddleware, usersController.create);
router.put('/:id', authMiddleware, usersController.update);
router.delete('/:id', authMiddleware, usersController.remove);

export default router;
