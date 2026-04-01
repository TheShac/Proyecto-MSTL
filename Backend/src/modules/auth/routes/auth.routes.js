import { Router } from 'express';
import passport from 'passport';
import { verifyToken } from '../../../Middlewares/auth.middleware.js';
import { authLimiter } from '../../../Middlewares/rateLimit.middleware.js';
import { validate } from '../../../Middlewares/validate.middleware.js';
import { loginSchema, registerCustomerSchema, editProfileSchema } from '../schema/auth.schema.js';
import {
  Login,
  registerCustomer,
  registerEmployee,
  getProfile,
  editProfile,
} from '../controllers/auth.controller.js';
import { googleCallback } from '../controllers/googleAuth.controller.js';

const router = Router();

// ── Credenciales ──────────────────────────────────────────────────────────────
router.post('/login',    authLimiter, validate(loginSchema),            Login);
router.post('/register', authLimiter, validate(registerCustomerSchema), registerCustomer);

// ── Empleados (requiere token — la validación de rol va en el controller) ─────
router.post('/register/employee', verifyToken, registerEmployee);

// ── Perfil del usuario autenticado ────────────────────────────────────────────
router.get ('/profile', verifyToken, getProfile);
router.put ('/profile', verifyToken, validate(editProfileSchema), editProfile);

// ── Google OAuth ──────────────────────────────────────────────────────────────
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  googleCallback
);

export default router;