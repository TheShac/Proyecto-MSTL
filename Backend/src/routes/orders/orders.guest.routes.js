import { Router } from "express";

import {
  getGuestCart,
  createGuestCart,
  addOrUpdateGuestCartItem,
  removeGuestCartItem,
  saveGuestCustomerInfo,
  saveGuestShippingAddress,
  checkoutGuestCart,
} from "../../controllers/orders/orders.guest.controller.js";

const router = Router();

// Crear carrito invitado (devuelve uuid_pedido)
router.post("/guest/cart", createGuestCart);

// Obtener carrito invitado por cartId
router.get("/guest/cart/:uuid_pedido", getGuestCart);

// Items
router.post("/guest/cart/:uuid_pedido/items", addOrUpdateGuestCartItem);
router.delete("/guest/cart/:uuid_pedido/items/:id_producto", removeGuestCartItem);

// Datos pedido + dirección
router.put("/guest/cart/:uuid_pedido/customer-info", saveGuestCustomerInfo);
router.put("/guest/cart/:uuid_pedido/address", saveGuestShippingAddress);

// Checkout
router.post("/guest/cart/:uuid_pedido/checkout", checkoutGuestCart);

export default router;
