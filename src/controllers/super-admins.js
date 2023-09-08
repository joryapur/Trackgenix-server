import SuperAdmins from '../models/Super-admins';
import isValidObjectId from '../utils/validateObjectId';
import firebase from '../helpers/firebase';

export const getAllSuperAdmins = async (req, res) => {
  try {
    const superAdmin = await SuperAdmins.find();
    if (!superAdmin.length) {
      return res.status(200).json({
        message: 'Super admins is empty',
        data: undefined,
        error: false,
      });
    }
    return res.status(200).json({
      message: 'Super Admins found',
      data: superAdmin,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Unexpected error ${error}`,
      data: undefined,
      error: true,
    });
  }
};

export const getSuperAdminsById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: `Invalid id: ${id}`,
        error: true,
      });
    }
    const superAdminFound = await SuperAdmins.findById(id);
    if (!superAdminFound) {
      return res.status(404).json({
        message: `Couldn't find super admin with id ${id}`,
        error: true,
      });
    }
    return res.status(200).json({
      message: `Found super admin with id ${id}`,
      data: superAdminFound,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Unexpected error ${error}`,
      data: undefined,
      error: true,
    });
  }
};

export const createSuperAdmins = async (req, res) => {
  try {
    const newFirebaseUser = await firebase.auth().createUser({
      email: req.body.email,
      password: req.body.password,
    });
    await firebase.auth().setCustomUserClaims(newFirebaseUser.uid, { role: 'super-admin' });
    const body = { ...req.body };
    delete body.password;
    const newSuperAdmin = await SuperAdmins.create(
      { ...body, firebaseUid: newFirebaseUser.uid },
    );

    const superAdmin = await newSuperAdmin.save();

    return res.status(201).json({
      message: 'Super admins created successfully',
      data: superAdmin,
      error: false,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || error,
      error: true,
    });
  }
};

export const updateSuperAdmins = async (req, res) => {
  try {
    await firebase.auth().updateUser(req.body.firebaseUid, {
      email: req.body.email,
      password: req.body.password,
    });

    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: `Invalid id: ${req.params.id}`,
        error: true,
      });
    }
    const body = { ...req.body };
    delete body.password;
    const updatedSuperAdmin = await SuperAdmins.findByIdAndUpdate(
      { _id: id },
      { ...body },
      { new: true },
    );
    if (updatedSuperAdmin == null) {
      return res.status(404).json({
        message: `Couldn't find super admin with id ${id}`,
        data: undefined,
        error: true,
      });
    }
    return res.status(200).json({
      message: `Modified super admin with id ${id}`,
      data: updatedSuperAdmin,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Unexpected error ${error}`,
      data: undefined,
      error: true,
    });
  }
};

export const deletedSuperAdmins = async (req, res) => {
  try {
    const { uid } = await req.headers;
    await firebase.auth().deleteUser(uid);

    const { id } = req.params;
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: `Invalid id: ${req.params.id}`,
        error: true,
      });
    }
    const deletedSuperAdmin = await SuperAdmins.findByIdAndDelete(id);
    if (!deletedSuperAdmin) {
      return res.status(404).json({
        message: `Couldn't find super admin with id ${id}`,
        error: true,
      });
    }
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({
      message: `Unexpected error ${error}`,
      data: undefined,
      error: true,
    });
  }
};
