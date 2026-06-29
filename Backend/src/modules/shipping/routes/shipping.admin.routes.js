import { Router } from 'express';
import {
  adminGetRates,
  adminCreateRate,
  adminUpdateRate,
  adminDeleteRate,
} from '../controllers/shipping.controller.js';

const router = Router();

// Montadas bajo /api/admin/shipping
router.get('/', adminGetRates);
router.post('/', adminCreateRate);
router.put('/:id', adminUpdateRate);
router.delete('/:id', adminDeleteRate);

export default router;
