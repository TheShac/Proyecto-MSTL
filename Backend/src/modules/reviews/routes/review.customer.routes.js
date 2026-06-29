import { Router } from 'express';
import { createReview, getMyProductReview } from '../controllers/review.controller.js';

const router = Router();

// Montadas bajo /api/customer/reviews (verifyToken + requireRole('customer') ya aplicados)
router.post('/', createReview);
router.get('/product/:id', getMyProductReview);

export default router;
