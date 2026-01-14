import { Router } from "express";
import { protect } from "../../Middlewares/authMiddleware.js";
import {
  getOffersPublic,
  getOffersAdmin,
  addOffer,
  addOfferBatch,
  updateOffer,
  removeOffer,
} from "../../controllers/products/offers.controller.js";

const router = Router();

// Público
router.get("/", getOffersPublic);

// Admin
router.get("/admin", protect, getOffersAdmin);
router.post("/", protect, addOffer);
router.post("/batch", protect, addOfferBatch);
router.put("/:id_producto", protect, updateOffer);
router.delete("/:id_producto", protect, removeOffer);

export default router;