import { Router } from 'express';
import { getAllCustomers, getCustomerById, deleteCustomer } from '../controllers/user.controller.js';

const router = Router();

// Estas rutas se montan bajo /api/admin/users (definido en admin.routes.js)
router.get('/',     getAllCustomers);
router.get('/:id',  getCustomerById);
router.delete('/:id', deleteCustomer);

export default router;
