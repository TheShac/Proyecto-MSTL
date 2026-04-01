import { Router } from 'express';
import {
  createGuestCart,
  getGuestCart,
  addOrUpdateGuestCartItem,
  removeGuestCartItem,
  saveGuestCustomerInfo,
  saveGuestShippingAddress,
  checkoutGuestCart,
} from '../controllers/orders.controller.js';

const router = Router();

// Montadas bajo /api/orders (guest.routes.js — público, sin token)
router.post  ('/guest/cart',                                  createGuestCart);
router.get   ('/guest/cart/:uuid_pedido',                     getGuestCart);
router.post  ('/guest/cart/:uuid_pedido/items',               addOrUpdateGuestCartItem);
router.delete('/guest/cart/:uuid_pedido/items/:id_producto',  removeGuestCartItem);
router.put   ('/guest/cart/:uuid_pedido/customer-info',       saveGuestCustomerInfo);
router.put   ('/guest/cart/:uuid_pedido/address',             saveGuestShippingAddress);
router.post  ('/guest/cart/:uuid_pedido/checkout',            checkoutGuestCart);

export default router;