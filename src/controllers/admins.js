import Admins from '../models/Admins';
import isValidObjectId from '../utils/validateObjectId';
import firebase from '../helpers/firebase';

export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admins.find();
    if (!admins.length) {
      return res.status(200).json({
        message: 'Admins is empty',
        data: undefined,
        error: false,
      });
    }
    return res.status(200).json({
      message: 'Admins found',
      data: admins,
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

export const getAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: `Invalid id: ${id}`,
        error: true,
      });
    }
    const admin = await Admins.findById(id);
    if (!admin) {
      return res.status(404).json({
        message: `Couldn't find admin with id ${id}`,
        error: true,
      });
    }
    return res.status(200).json({
      message: `Found admin with id ${id}`,
      data: admin,
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

export const createAdmin = async (req, res) => {
  try {
    const newFirebaseUser = await firebase.auth().createUser({
      email: req.body.email,
      password: req.body.password,
    });
    await firebase.auth().setCustomUserClaims(newFirebaseUser.uid, { role: 'admin' });
    const body = { ...req.body };
    delete body.password;
    const newAdmin = await Admins.create({ ...body, firebaseUid: newFirebaseUser.uid });

    const admin = await newAdmin.save();

    return res.status(201).json({
      message: 'Admin created successfully',
      data: admin,
      error: false,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || error,
      error: true,
    });
  }
};

export const updateAdmin = async (req, res) => {
  try {
    await firebase.auth().updateUser(req.body.firebaseUid, {
      email: req.body.email,
      password: req.body.password,
    });

    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: `Invalid id: ${id}`,
        error: true,
      });
    }
    const body = { ...req.body };
    delete body.password;
    const updatedAdmin = await Admins.findByIdAndUpdate(
      { _id: id },
      { ...body },
      { new: true },
    );
    if (updatedAdmin == null) {
      return res.status(404).json({
        message: `Couldn't find admin with id ${id}`,
        data: undefined,
        error: true,
      });
    }
    return res.status(200).json({
      message: `Modified admin with id ${id}`,
      data: updatedAdmin,
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

export const deleteAdmin = async (req, res) => {
  try {
    const { uid } = await req.headers;
    await firebase.auth().deleteUser(uid);

    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: `Invalid id: ${id}`,
        error: true,
      });
    }
    const deletedAdmin = await Admins.findByIdAndDelete(id);
    if (deletedAdmin == null) {
      return res.status(404).json({
        message: `Couldn't find admin with id ${id}`,
        data: undefined,
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
