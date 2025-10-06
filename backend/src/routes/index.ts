import { Router } from 'express';
import authRoutes from './auth.routes';
import usersRoutes from './users.routes';
import productsRoutes from './products.routes';
import ordersRoutes from './orders.routes';
import inventoryRoutes from './inventory.routes';
import manufacturingRoutes from './manufacturing.routes';
import financialRoutes from './financial.routes';
import itemCodesRoutes from './itemCodes.routes';
import bomRoutes from './bom.routes';
import customersRoutes from './customers.routes';
import auditRoutes from './audit.routes';
import withdrawalsRoutes from './withdrawals.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/products', productsRoutes);
router.use('/orders', ordersRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/manufacturing', manufacturingRoutes);
router.use('/financial', financialRoutes);
router.use('/item-codes', itemCodesRoutes);
router.use('/boms', bomRoutes);
router.use('/customers', customersRoutes);
router.use('/audit', auditRoutes);
router.use('/withdrawals', withdrawalsRoutes);

export default router;
