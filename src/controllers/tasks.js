import Tasks from '../models/Tasks';
import isValidObjectId from '../utils/validateObjectId';

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Tasks.find();
    if (!tasks.length) {
      return res.status(200).json({
        message: 'Tasks is empty',
        data: undefined,
        error: false,
      });
    }
    return res.status(200).json({
      message: 'Tasks found',
      data: tasks,
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

export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: `Invalid id: ${id}`,
        error: true,
      });
    }
    const foundTask = await Tasks.findById(id);
    if (!foundTask) {
      return res.status(404).json({
        message: `Couldn't find task with id ${id}`,
        error: true,
      });
    }
    return res.status(200).json({
      message: `Found task with id ${id}`,
      data: foundTask,
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

export const createTask = async (req, res) => {
  try {
    const newTask = await Tasks.create(req.body);
    return res.status(201).json({
      message: 'Task created successfully',
      data: newTask,
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

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: `Invalid id ${id}`,
        error: true,
      });
    }
    const updatedTask = await Tasks.findByIdAndUpdate(
      { _id: id },
      { ...req.body },
      { new: true },
    );
    if (!updatedTask) {
      return res.status(404).json({
        message: `Couldn't find task with id ${id}`,
        data: undefined,
        error: true,
      });
    }
    return res.status(200).json({
      message: `Modified task with id ${id}`,
      data: updatedTask,
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

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: `Invalid id ${id}`,
        error: true,
      });
    }
    const taskFound = await Tasks.findByIdAndDelete(id);
    if (!taskFound) {
      return res.status(404).json({
        message: `Couldn't find task with id ${id}`,
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
