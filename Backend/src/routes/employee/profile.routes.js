import { Router } from "express";
import { protect } from "../../Middlewares/authMiddleware.js";

import {
  getMyEmployeeProfile,
  upsertMyEmployeeAddress,
  changeMyEmployeePassword,
  updateMyEmployeeProfile,
} from "../../controllers/employee/profile.controller.js";

const router = Router();

router.get("/me", protect, getMyEmployeeProfile);
router.put("/me", protect, updateMyEmployeeProfile);
router.put("/me/address", protect, upsertMyEmployeeAddress);
router.patch("/me/password", protect, changeMyEmployeePassword);

export default router;
