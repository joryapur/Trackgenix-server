import express from 'express';
import {
  getAllSuperAdmins, getSuperAdminsById, createSuperAdmins, updateSuperAdmins, deletedSuperAdmins,
} from '../controllers/super-admins';
import validateUser from '../validations/user';
import checkAuth from '../middelwares/authMiddelware';

const router = express.Router();

router
  .get('/', checkAuth(['super-admin']), getAllSuperAdmins)
  .get('/:id', checkAuth(['super-admin']), getSuperAdminsById)
  .post('/', checkAuth(['super-admin']), validateUser, createSuperAdmins)
  .put('/:id', checkAuth(['super-admin']), validateUser, updateSuperAdmins)
  .delete('/:id', checkAuth(['super-admin']), deletedSuperAdmins);

export default router;
