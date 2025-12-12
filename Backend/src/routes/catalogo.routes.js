import { Router } from 'express';
import { getEditorials, getGenres } from '../controllers/catalogo.controller.js';

const router = Router();

router.get('/editorials', getEditorials);
router.get('/genres', getGenres);

export default router;
