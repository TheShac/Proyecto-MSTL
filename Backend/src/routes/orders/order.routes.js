import { Router } from "express";
import { protect } from "../../Middlewares/authMiddleware.js";
import {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} from "../../controllers/orders/orders.controller.js";

const router = Router();

router.get("/", protect, getAllOrders);
router.get("/:id", protect, getOrderById);
router.patch("/:id/status", protect, updateOrderStatus);

export default router;
