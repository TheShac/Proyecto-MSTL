import { Router } from 'express';
import {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  updateEmployeePassword,
} from '../controllers/employee.controller.js';

const router = Router();

// Montadas bajo /api/admin/employees (admin.routes.js aplica verifyToken + requireRole)
router.get('/',                  getAllEmployees);
router.post('/',                 createEmployee);
router.get('/:id',               getEmployeeById);
router.put('/:id',               updateEmployee);
router.delete('/:id',            deleteEmployee);
router.patch('/:id/password',    updateEmployeePassword);

export default router;