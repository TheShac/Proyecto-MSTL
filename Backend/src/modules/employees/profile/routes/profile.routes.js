import { Router } from 'express';
import {
  getMyEmployeeProfile,
  updateMyEmployeeProfile,
  upsertMyEmployeeAddress,
  changeMyEmployeePassword,
} from '../controllers/profile.controller.js';

const router = Router();

// Montadas bajo /api/admin/profile (verifyToken ya aplicado en admin.routes.js)
router.get ('/',          getMyEmployeeProfile);
router.put ('/',          updateMyEmployeeProfile);
router.put ('/address',   upsertMyEmployeeAddress);
router.patch('/password', changeMyEmployeePassword);

export default router;