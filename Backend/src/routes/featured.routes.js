import { Router } from "express";
import {
  getFeaturedPublic,
  getFeaturedAdmin,
  addFeatured,
  updateFeatured,
  removeFeatured,
  reorderFeatured,
} from "../controllers/featured.controller.js";
import { protect } from "../Middlewares/authMiddleware.js";

const router = Router();

// Público
router.get("/", getFeaturedPublic);

// Admin (protegido)
router.get("/admin", protect, getFeaturedAdmin);
router.post("/", protect, addFeatured);
router.put("/reorder", protect, reorderFeatured);
router.put("/:id_producto", protect, updateFeatured);
router.delete("/:id_producto", protect, removeFeatured);

export default router;
