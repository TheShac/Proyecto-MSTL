import { Router } from 'express';
import { protect } from '../../middlewares/authMiddleware.js';

import {
  getInventoryProducts,
  adjustInventoryStock,
  getInventoryMovements,
} from '../../controllers/products/inventory.controller.js';

const router = Router();

router.get('/products', protect, getInventoryProducts);
router.get('/movements', protect, getInventoryMovements);
router.post('/adjust', protect, adjustInventoryStock);

export default router;
