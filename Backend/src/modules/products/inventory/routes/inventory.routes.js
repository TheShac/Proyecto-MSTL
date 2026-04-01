import { Router } from 'express';
import {
  getInventoryProducts,
  getInventoryMovements,
  adjustInventoryStock,
} from '../controllers/inventory.controller.js';

const router = Router();

// Montadas bajo /api/admin/inventory (verifyToken ya aplicado en admin.routes.js)
router.get('/products',  getInventoryProducts);
router.get('/movements', getInventoryMovements);
router.post('/adjust',   adjustInventoryStock);

export default router;