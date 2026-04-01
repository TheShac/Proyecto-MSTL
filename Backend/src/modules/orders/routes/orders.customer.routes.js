import { Router } from 'express';
import { checkoutLimiter } from '../../../Middlewares/rateLimit.middleware.js';
import {
  getMyCart,
  addOrUpdateCartItem,
  removeCartItem,
  saveCustomerInfo,
  saveShippingAddress,
  checkoutCart,
} from '../controllers/orders.controller.js';

const router = Router();

// Montadas bajo /api/customer/orders (verifyToken + requireRole('customer') ya aplicados)
router.get   ('/cart',                    getMyCart);
router.post  ('/cart/items',              addOrUpdateCartItem);
router.delete('/cart/items/:id_producto', removeCartItem);
router.put   ('/cart/customer-info',      saveCustomerInfo);
router.put   ('/cart/address',            saveShippingAddress);
router.post('/cart/checkout', checkoutLimiter, checkoutCart);

export default router;