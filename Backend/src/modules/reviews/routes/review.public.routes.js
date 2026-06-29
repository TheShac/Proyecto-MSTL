import { Router } from 'express';
import { getRecentReviews, getProductReviews } from '../controllers/review.controller.js';

const router = Router();

// Montadas bajo /api/reviews (guest portal — público)
router.get('/recent', getRecentReviews);
router.get('/product/:id', getProductReviews);

export default router;
