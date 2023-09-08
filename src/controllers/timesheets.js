import Timesheets from '../models/Timesheets';
import isValidObjectId from '../utils/validateObjectId';

export const getAllTimesheets = async (req, res) => {
  try {
    const timesheets = await Timesheets.find().populate('employee').populate('project').populate('task');
    if (timesheets.length === 0) {
      return res.status(200).json({
        message: 'Timesheets is empty',
        data: undefined,
        error: false,
      });
    }
    return res.status(200).json({
      message: 'Timesheets found',
      data: timesheets,
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

export const getTimesheetById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: `Invalid id: ${id}`,
        error: true,
      });
    }
    const timesheets = await Timesheets.findById(id).populate('employee').populate('project').populate('task');
    if (!timesheets) {
      return res.status(404).json({
        message: `Couldn't find timesheet with id ${id}`,
        error: true,
      });
    }
    return res.status(200).json({
      message: `Found timesheet with id ${id}`,
      data: timesheets,
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

export const createTimesheet = async (req, res) => {
  try {
    const { task } = req.body;
    const { project } = req.body;
    const { employee } = req.body;
    if (!isValidObjectId(task) || !isValidObjectId(project) || !isValidObjectId(employee)) {
      return res.status(400).json({
        message: 'Task, project or employee is invalid',
        error: true,
      });
    }
    const timesheets = await Timesheets.create(req.body);

    return res.status(201).json({
      message: 'Timesheet created successfully',
      data: timesheets,
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

export const updateTimesheets = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: `Invalid id: ${req.params.id}`,
        error: true,
      });
    }
    const updatedTimesheet = await Timesheets.findByIdAndUpdate(
      { _id: id },
      { ...req.body },
      { new: true },
    );
    if (!updatedTimesheet) {
      return res.status(404).json({
        message: `Couldn't find timesheet with id ${id}`,
        data: undefined,
        error: true,
      });
    }
    return res.status(200).json({
      message: `Modified timesheet with id ${id}`,
      data: updatedTimesheet,
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

export const deleteTimesheet = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: `Invalid id: ${id}`,
        error: true,
      });
    }
    const deletedTimesheet = await Timesheets.findByIdAndDelete(id);
    if (!deletedTimesheet) {
      return res.status(404).json({
        message: `Couldn't find timesheet with id ${id}`,
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
