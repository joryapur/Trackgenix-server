import Employee from '../models/Employees';
import isValidObjectId from '../utils/validateObjectId';
import firebase from '../helpers/firebase';

export const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    if (!employees.length) {
      return res.status(200).json({
        message: 'Employees is empty',
        data: undefined,
        error: false,
      });
    }
    return res.status(200).json({
      message: 'Employees found',
      data: employees,
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

export const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: `Invalid id: ${id}`,
        error: true,
      });
    }
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({
        message: `Couldn't find employee with id ${id}`,
        data: undefined,
        error: true,
      });
    }
    return res.status(200).json({
      message: `Found employee with id ${id}`,
      data: employee,
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

export const createEmployee = async (req, res) => {
  try {
    const newFirebaseUser = await firebase.auth().createUser({
      email: req.body.email,
      password: req.body.password,
    });
    await firebase.auth().setCustomUserClaims(newFirebaseUser.uid, { role: 'employee' });
    const body = { ...req.body };
    delete body.password;
    const newEmployee = await Employee.create({ ...body, firebaseUid: newFirebaseUser.uid });

    const employee = await newEmployee.save();

    return res.status(201).json({
      message: 'Employee created successfully',
      data: employee,
      error: false,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || error,
      error: true,
    });
  }
};

export const updateEmployee = async (req, res) => {
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
    const updatedEmployee = await Employee.findByIdAndUpdate(
      { _id: id },
      { ...body },
      { new: true },
    );
    if (!updatedEmployee) {
      return res.status(404).json({
        message: `Couldn't find employee with id ${id}`,
        data: undefined,
        error: true,
      });
    }
    return res.status(200).json({
      message: `Modified employee with id ${id}`,
      data: updatedEmployee,
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

export const deleteEmployee = async (req, res) => {
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
    const deletedEmployee = await Employee.findByIdAndDelete(id);
    if (!deletedEmployee) {
      return res.status(404).json({
        message: `Couldn't find employee with id ${id}`,
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
