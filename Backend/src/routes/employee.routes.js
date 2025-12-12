import { Router } from 'express';
import { protect } from '../Middlewares/authMiddleware.js';
import { createEmployee, getAllEmployees, getEmployeeById, updateEmployee, deleteEmployee, updateEmployeePassword } from '../controllers/employeeController.js';

const router = Router();

router.use(protect);

router.post('/', createEmployee);
router.get('/', getAllEmployees);
router.get('/:id', getEmployeeById);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);
router.put('/:id/password', updateEmployeePassword);

export default router;
