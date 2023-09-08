import express from 'express';
import {
  getAllAdmins, getAdminById, createAdmin, updateAdmin, deleteAdmin,
} from '../controllers/admins';
import validateUser from '../validations/user';
import checkAuth from '../middelwares/authMiddelware';

const router = express.Router();

router
  .get('/', checkAuth(['super-admin', 'admin']), getAllAdmins)
  .get('/:id', checkAuth(['super-admin', 'admin']), getAdminById)
  .post('/', checkAuth(['super-admin']), validateUser, createAdmin)
  .put('/:id', checkAuth(['super-admin', 'admin']), validateUser, updateAdmin)
  .delete('/:id', checkAuth(['super-admin', 'admin']), deleteAdmin);

export default router;
