import express from 'express';
import {
  getAllEmployees, getEmployeeById, createEmployee, updateEmployee, deleteEmployee,
} from '../controllers/employees';
import validateUser from '../validations/user';
import checkAuth from '../middelwares/authMiddelware';

const router = express.Router();

router
  .get('/', checkAuth(['super-admin', 'admin', 'employee']), getAllEmployees)
  .get('/:id', checkAuth(['super-admin', 'admin', 'employee']), getEmployeeById)
  .post('/', validateUser, createEmployee)
  .put('/:id', checkAuth(['super-admin', 'admin', 'employee']), validateUser, updateEmployee)
  .delete('/:id', checkAuth(['super-admin', 'admin', 'employee']), deleteEmployee);

export default router;
