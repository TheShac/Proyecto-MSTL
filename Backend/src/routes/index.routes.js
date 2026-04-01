import { Router } from 'express';

import authRoutes     from '../modules/auth/routes/auth.routes.js';
import adminRoutes    from './portals/admin.routes.js';
import customerRoutes from './portals/customer.routes.js';
import guestRoutes    from './portals/guest.routes.js';

const router = Router();

// ── Auth — público ────────────────────────────────────────────────────────────
router.use('/auth', authRoutes);

// ── Portals ───────────────────────────────────────────────────────────────────
router.use('/admin',    adminRoutes);
router.use('/customer', customerRoutes);
router.use('/',         guestRoutes);

export default router;