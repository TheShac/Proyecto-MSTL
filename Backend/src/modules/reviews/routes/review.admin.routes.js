import { Router } from 'express';
import { adminGetReviews, adminDeleteReview } from '../controllers/review.controller.js';

const router = Router();

// Montadas bajo /api/admin/reviews
router.get('/', adminGetReviews);
router.delete('/:id', adminDeleteReview);

export default router;
