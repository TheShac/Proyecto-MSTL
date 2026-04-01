import { Router } from 'express';
import {
  getFeaturedPublic,
  getFeaturedAdmin,
  addFeatured,
  updateFeatured,
  removeFeatured,
  reorderFeatured,
} from '../controllers/featured.controller.js';

const router = Router();

// Público — montado en guest.routes.js bajo /api/featured
router.get('/', getFeaturedPublic);

// Admin — montado en admin.routes.js bajo /api/admin/featured
router.get('/admin',           getFeaturedAdmin);
router.post('/',               addFeatured);
router.put('/reorder',         reorderFeatured);
router.put('/:id_producto',    updateFeatured);
router.delete('/:id_producto', removeFeatured);

export default router;