import { Router } from 'express';
import { verifyToken, requireRole } from '../../Middlewares/auth.middleware.js';

import orderCustomerRoutes from '../../modules/orders/routes/orders.customer.routes.js';

const router = Router();

// ── Protección global del portal customer ─────────────────────────────────────
router.use(verifyToken, requireRole('customer'));

// ── Rutas del cliente autenticado ─────────────────────────────────────────────
router.use('/orders', orderCustomerRoutes);

export default router;