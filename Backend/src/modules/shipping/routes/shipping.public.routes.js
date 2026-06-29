import { Router } from 'express';
import { getActiveRates } from '../controllers/shipping.controller.js';

const router = Router();

// Montadas bajo /api/shipping (público)
router.get('/', getActiveRates);

export default router;
