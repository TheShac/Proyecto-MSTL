import { Router } from "express";
import { protect } from "../../Middlewares/authMiddleware.js";
import {
  getOffersPublic,
  getOffersAdmin,
  upsertOffer,
  removeOffer,
  applyOfferBulk,
} from "../../controllers/products/offers.controller.js";

const router = Router();

// Público
router.get("/", getOffersPublic);

// Admin
router.get("/admin", protect, getOffersAdmin);
router.post("/bulk", protect, applyOfferBulk);
router.post("/:id_producto", protect, upsertOffer);
router.delete("/:id_producto", protect, removeOffer);

export default router;
