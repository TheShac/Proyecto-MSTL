import { Router } from 'express';
import {
  getOffersPublic,
  getOffersAdmin,
  addOffer,
  updateOffer,
  removeOffer,
  addOfferBatch,
} from '../controllers/offers.controller.js';

const router = Router();

// Público — montado en guest.routes.js bajo /api/offers
router.get('/', getOffersPublic);

// Admin — montado en admin.routes.js bajo /api/admin/offers
router.get('/admin',              getOffersAdmin);
router.post('/',                  addOffer);
router.post('/batch',             addOfferBatch);
router.put('/:id_producto',       updateOffer);
router.delete('/:id_producto',    removeOffer);

export default router;