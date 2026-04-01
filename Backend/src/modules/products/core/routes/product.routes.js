import { Router } from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCatalog,
} from '../controllers/product.controller.js';

const router = Router();

// Montadas bajo /api/admin/products
router.get('/',           getAllProducts);
router.get('/catalog',    getCatalog);
router.get('/:id',        getProductById);
router.post('/',          createProduct);
router.put('/:id',        updateProduct);
router.delete('/:id',     deleteProduct);

export default router;