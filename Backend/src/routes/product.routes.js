import { Router } from 'express';
import { getAllProducts, getProductById, CreateProducto, ActualizarProducto, EliminarProducto, getCatalog } from '../controllers/productController.js';
import { protect } from '../Middlewares/authMiddleware.js';


const router = Router();

// OBTENER TODOS LOS PRODUCTOS
router.get('/', getAllProducts);

// CATÁLOGO DE PRODUCTOS CON FILTROS, BÚSQUEDA Y PAGINACIÓN
router.get("/catalog", getCatalog);

// OBTENER PRODUCTO POR SU ID
router.get('/:id', getProductById);

// CREAR NUEVO PRODUCTO
router.post('/create', protect, CreateProducto);

// ACTUALIZAR PRODUCTO
router.put('/:id', protect, ActualizarProducto);

// ELIMINAR PRODUCTO
router.delete('/:id', protect, EliminarProducto);

export default router