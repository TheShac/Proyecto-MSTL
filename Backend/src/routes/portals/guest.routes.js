import { Router } from 'express';

import { productPublicRoutes } from '../../modules/products/core/routes/product.routes.js';
import catalogoRoutes  from '../../modules/products/catalog/routes/catalogo.routes.js';
import featuredRoutes  from '../../modules/products/featured/routes/featured.routes.js';
import offersRoutes    from '../../modules/products/offers/routes/offers.routes.js';
import orderGuestRoutes from '../../modules/orders/routes/orders.guest.routes.js';

const router = Router();

// ── Rutas públicas — sin token ────────────────────────────────────────────────
router.use('/products',  productPublicRoutes);
router.use('/catalogo',  catalogoRoutes);
router.use('/featured',  featuredRoutes);
router.use('/offers',    offersRoutes);
router.use('/orders',    orderGuestRoutes);

export default router;