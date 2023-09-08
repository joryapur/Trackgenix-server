import Projects from '../models/Projects';
import isValidObjectId from '../utils/validateObjectId';

export const getAllProjects = async (req, res) => {
  try {
    const projects = await Projects.find(req.query)
      .populate('teamMembers.employee')
      .populate('employeePM.employee');
    if (!projects.length) {
      return res.status(200).json({
        message: 'Projects is empty',
        data: undefined,
        error: false,
      });
    }
    return res.status(200).json({
      message: 'Projects found',
      data: projects,
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

export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: `Invalid id: ${req.params.id}`,
        error: true,
      });
    }
    const project = await Projects.findById(id)
      .populate('teamMembers.employee')
      .populate('employeePM.employee');
    if (!project) {
      return res.status(404).json({
        message: `Couldn't find project with id ${id}`,
        error: true,
      });
    }
    return res.status(200).json({
      message: `Found project with id ${id}`,
      data: project,
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

export const createProject = async (req, res) => {
  try {
    const newProject = await Projects.create(req.body);
    return res.status(201).json({
      message: 'Project created successfully',
      data: newProject,
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

export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: `Invalid id ${id}.`,
        error: true,
      });
    }
    const updatedProject = await Projects.findByIdAndUpdate(
      { _id: id },
      { ...req.body },
      { new: true },
    );
    if (updatedProject == null) {
      return res.status(404).json({
        message: `Couldn't find project with id ${id}`,
        data: undefined,
        error: true,
      });
    }
    return res.status(200).json({
      message: `Modified project with id ${id}`,
      data: updatedProject,
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

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    if (isValidObjectId(id)) {
      const result = await Projects.findByIdAndDelete(id);
      if (result !== null) {
        return res.sendStatus(204);
      }
      return res.status(404).json({
        message: `there is not project with this id ${id}.`,
        error: true,
      });
    }
    return res.status(400).json({
      message: `Invalid id ${id}.`,
      error: true,
    });
  } catch (error) {
    return res.status(500)({
      message: error,
      data: undefined,
      error: true,
    });
  }
};
