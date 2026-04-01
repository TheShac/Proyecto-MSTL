import { Router } from 'express';
import { getEditorials, getGenres } from '../controllers/catalogo.controller.js';

const router = Router();

// Montadas bajo /api/catalogo (guest.routes.js — público)
router.get('/editorials', getEditorials);
router.get('/genres',     getGenres);

export default router;