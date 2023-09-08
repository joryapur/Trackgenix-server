import express from 'express';
import {
  getAllProjects, getProjectById, createProject, updateProject, deleteProject,
} from '../controllers/projects';
import validateProject from '../validations/projects';
import checkAuth from '../middelwares/authMiddelware';

const router = express.Router();

router
  .get('/', checkAuth(['super-admin', 'admin', 'employee']), getAllProjects)
  .get('/:id', checkAuth(['super-admin', 'admin', 'employee']), getProjectById)
  .post('/', checkAuth(['super-admin', 'admin', 'employee']), validateProject, createProject)
  .put('/:id', checkAuth(['super-admin', 'admin', 'employee']), validateProject, updateProject)
  .delete('/:id', checkAuth(['super-admin', 'admin']), deleteProject);

export default router;
