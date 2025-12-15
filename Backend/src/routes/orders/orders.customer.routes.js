import { Router } from "express";
import { protect } from "../../Middlewares/authMiddleware.js";

import {
  getMyCart,
  addOrUpdateCartItem,
  removeCartItem,
  saveCustomerInfo,
  saveShippingAddress,
  checkoutCart,
} from "../../controllers/orders/orders.customer.controller.js";

const router = Router();

// CUSTOMER CART
router.get("/customer/cart", protect, getMyCart);
router.post("/customer/cart/items", protect, addOrUpdateCartItem);
router.delete("/customer/cart/items/:id_producto", protect, removeCartItem);

// Guardar datos del pedido y dirección
router.put("/customer/cart/customer-info", protect, saveCustomerInfo);
router.put("/customer/cart/address", protect, saveShippingAddress);

// Checkout
router.post("/customer/cart/checkout", protect, checkoutCart);

export default router;
