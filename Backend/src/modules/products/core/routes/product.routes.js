import { Router } from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCatalog,
} from '../controllers/product.controller.js';

// ── Rutas públicas — lectura ──────────────────────────────────────────────────
export const productPublicRoutes = Router();

productPublicRoutes.get('/',         getAllProducts);
productPublicRoutes.get('/catalog',  getCatalog);
productPublicRoutes.get('/:id',      getProductById);

// ── Rutas admin — escritura ───────────────────────────────────────────────────
export const productAdminRoutes = Router();

productAdminRoutes.post('/',      createProduct);
productAdminRoutes.put('/:id',    updateProduct);
productAdminRoutes.delete('/:id', deleteProduct);