import express from 'express';
import {
  getAllTasks, getTaskById, createTask, updateTask, deleteTask,
} from '../controllers/tasks';
import validateTask from '../validations/tasks';
import checkAuth from '../middelwares/authMiddelware';

const router = express.Router();

router
  .get('/', checkAuth(['super-admin', 'admin', 'employee']), getAllTasks)
  .get('/:id', checkAuth(['super-admin', 'admin', 'employee']), getTaskById)
  .post('/', checkAuth(['super-admin', 'admin', 'employee']), validateTask, createTask)
  .put('/:id', checkAuth(['super-admin', 'admin']), validateTask, updateTask)
  .delete('/:id', checkAuth(['super-admin', 'admin']), deleteTask);

export default router;
