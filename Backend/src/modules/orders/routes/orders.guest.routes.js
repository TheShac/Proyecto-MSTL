import { Router } from 'express';
import {
  createGuestCart,
  getGuestCart,
  addOrUpdateGuestCartItem,
  removeGuestCartItem,
  saveGuestCustomerInfo,
  saveGuestShippingAddress,
  checkoutGuestCart,
  payGuestOrder,
  trackOrder,
} from '../controllers/orders.controller.js';

const router = Router();

// Seguimiento público de pedido por código
router.get('/track/:uuid_pedido', trackOrder);

// Montadas bajo /api/orders (guest.routes.js — público, sin token)
router.post  ('/guest/cart',                                  createGuestCart);
router.get   ('/guest/cart/:uuid_pedido',                     getGuestCart);
router.post  ('/guest/cart/:uuid_pedido/items',               addOrUpdateGuestCartItem);
router.delete('/guest/cart/:uuid_pedido/items/:id_producto',  removeGuestCartItem);
router.put   ('/guest/cart/:uuid_pedido/customer-info',       saveGuestCustomerInfo);
router.put   ('/guest/cart/:uuid_pedido/address',             saveGuestShippingAddress);
router.post  ('/guest/cart/:uuid_pedido/checkout',            checkoutGuestCart);
router.post  ('/guest/cart/:uuid_pedido/pay',                 payGuestOrder);

export default router;