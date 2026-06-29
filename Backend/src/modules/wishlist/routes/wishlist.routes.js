import { Router } from 'express';
import { getWishlist, addToWishlist, removeFromWishlist } from '../controllers/wishlist.controller.js';

const router = Router();

// Montadas bajo /api/customer/wishlist (verifyToken + requireRole('customer') ya aplicados)
router.get('/', getWishlist);
router.post('/', addToWishlist);
router.delete('/:id_producto', removeFromWishlist);

export default router;
