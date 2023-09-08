import express from 'express';
import {
  getAllTimesheets, getTimesheetById, createTimesheet, updateTimesheets, deleteTimesheet,
} from '../controllers/timesheets';
import validateTimesheet from '../validations/timesheets';
import checkAuth from '../middelwares/authMiddelware';

const router = express.Router();

router
  .get('/', checkAuth(['super-admin', 'admin', 'employee']), getAllTimesheets)
  .get('/:id', checkAuth(['super-admin', 'admin', 'employee']), getTimesheetById)
  .post('/', checkAuth(['super-admin', 'admin', 'employee']), validateTimesheet, createTimesheet)
  .put('/:id', checkAuth(['super-admin', 'admin', 'employee']), validateTimesheet, updateTimesheets)
  .delete('/:id', checkAuth(['super-admin', 'admin', 'employee']), deleteTimesheet);

export default router;
