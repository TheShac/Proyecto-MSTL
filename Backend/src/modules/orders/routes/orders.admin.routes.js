import { Router } from 'express';
import { getAllOrders, getOrderById, updateOrderStatus } from '../controllers/orders.controller.js';

const router = Router();

// Montadas bajo /api/admin/orders (verifyToken + requireRole ya aplicados)
router.get('/',              getAllOrders);
router.get('/:id',           getOrderById);
router.patch('/:id/status',  updateOrderStatus);

export default router;