import express from 'express';

import superAdminsRoutes from './super-admins';
import timeSheetsRouter from './timesheets';
import employeesRoutes from './employees';
import tasksRoutes from './tasks';
import adminsRoutes from './admins';
import projectsRoutes from './projects';

const router = express.Router();

router.use('/time-sheets', timeSheetsRouter);
router.use('/projects', projectsRoutes);
router.use('/employees', employeesRoutes);
router.use('/tasks', tasksRoutes);
router.use('/admins', adminsRoutes);
router.use('/super-admins', superAdminsRoutes);

export default router;
