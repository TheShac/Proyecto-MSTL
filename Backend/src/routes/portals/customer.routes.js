import { Router } from 'express';
import { verifyToken, requireRole } from '../../Middlewares/auth.middleware.js';

import orderCustomerRoutes from '../../modules/orders/routes/orders.customer.routes.js';
import addressRoutes       from '../../modules/users/routes/address.routes.js';
import wishlistRoutes      from '../../modules/wishlist/routes/wishlist.routes.js';
import reviewCustomerRoutes from '../../modules/reviews/routes/review.customer.routes.js';

const router = Router();

// ── Protección global del portal customer ─────────────────────────────────────
router.use(verifyToken, requireRole('customer'));

// ── Rutas del cliente autenticado ─────────────────────────────────────────────
router.use('/orders',   orderCustomerRoutes);
router.use('/address',  addressRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/reviews',  reviewCustomerRoutes);

export default router;