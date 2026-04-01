import { Router } from 'express';
import { verifyToken, requireRole } from '../../Middlewares/auth.middleware.js';

import productRoutes   from '../../modules/products/core/routes/product.routes.js';
import inventoryRoutes from '../../modules/products/inventory/routes/inventory.routes.js';
import catalogoRoutes  from '../../modules/products/catalog/routes/catalogo.routes.js';
import offersRoutes    from '../../modules/products/offers/routes/offers.routes.js';
import featuredRoutes  from '../../modules/products/featured/routes/featured.routes.js';

import employeeRoutes  from '../../modules/employees/routes/employee.routes.js';
import profileRoutes   from '../../modules/employees/profile/routes/profile.routes.js';

import userRoutes      from '../../modules/users/routes/user.routes.js';

import orderRoutes     from '../../modules/orders/routes/orders.admin.routes.js';

const router = Router();

const ADMIN_ROLES = ['stl_administrador', 'stl_superadministrador'];

// ── Protección global del portal admin ───────────────────────────────────────
router.use(verifyToken);

// ── Rutas accesibles a cualquier empleado ─────────────────────────────────────
router.use('/products',   requireRole('employee'), productRoutes);
router.use('/inventory',  requireRole('employee'), inventoryRoutes);
router.use('/catalogo',   requireRole('employee'), catalogoRoutes);
router.use('/profile',    requireRole('employee'), profileRoutes);

// ── Rutas exclusivas de administradores ───────────────────────────────────────
router.use('/employees',  requireRole(...ADMIN_ROLES), employeeRoutes);
router.use('/users',      requireRole(...ADMIN_ROLES), userRoutes);
router.use('/orders',     requireRole(...ADMIN_ROLES), orderRoutes);
router.use('/offers',     requireRole(...ADMIN_ROLES), offersRoutes);
router.use('/featured',   requireRole(...ADMIN_ROLES), featuredRoutes);

export default router;