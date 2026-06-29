import { Router } from 'express';
import { getMyAddress, upsertMyAddress } from '../controllers/customerAddress.controller.js';

const router = Router();

// Montadas bajo /api/customer/address (verifyToken + requireRole('customer') ya aplicados)
router.get('/', getMyAddress);
router.put('/', upsertMyAddress);

export default router;
