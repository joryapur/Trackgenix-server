import Joi from 'joi';

const validateProject = (req, res, next) => {
  const teamMembersValidation = Joi.object({
    employee: Joi.string().required()
      .messages({
        'string.empty': 'Team members must be a valid employee',
        'any.required': 'Team members must be a valid employee',
      }),
    role: Joi.string().required().valid('DEV', 'QA', 'TL', 'PM')
      .messages({
        'string.empty': 'role required',
        'any.only': 'role can only be DEV, QA, TL or PM',
        'any.required': 'role required',
      }),
    rate: Joi.number().min(1).max(1000).required()
      .messages({
        'string.empty': 'Rate required',
        'number.pattern.base': 'Rate should be numbers only',
        'number.min': 'Rate should have a minimum of 1',
        'number.max': 'Rate should have a maximum of 1000',
        'any.required': 'Rate required',
      }),
  });

  const projectsValidations = Joi.object({
    name: Joi.string().min(3).max(30).regex(/^[\w\s]+$/)
      .required()
      .messages({
        'string.empty': 'Name required',
        'string.pattern.base': 'Name should be letters, numbers or spaces only',
        'string.min': 'Name should have a minimum length of 3 characters',
        'string.max': 'Name should have a maximum length of 30 characters',
        'any.required': 'Name required',
      }),
    description: Joi.string().min(5).max(150).required()
      .messages({
        'string.empty': 'Description required',
        'string.min': 'Description should have a minimum length of 5 characters',
        'string.max': 'Description should have a maximum length of 150 characters',
        'any.required': 'Description required',
      }),
    startDate: Joi.date().required()
      .messages({
        'string.empty': 'StartDate required',
        'any.required': 'StartDate required',
      }),
    endDate: Joi.date()
      .messages({
        'date.pattern.base': 'EndDate must be a valid date',
      }),
    active: Joi.boolean().required()
      .messages({
        'boolean.empty': 'Active required',
        'string.pattern.base': 'Active should be true or false',
        'any.required': 'Active required',
      }),
    clientName: Joi.string().min(2).max(30).required()
      .messages({
        'string.empty': 'clientName required',
        'string.min': 'clientName should have a minimum length of 2 characters',
        'string.max': 'clientName should have a maximum length of 30 characters',
        'any.required': 'clientName required',
      }),
    employeePM: Joi.object({
      employee: Joi.string().required()
        .messages({
          'string.empty': 'Employee Product Manager must be a valid employee',
          'any.required': 'Employee Product Manager must be a valid employee',
        }),
      role: Joi.string().valid('PM').required()
        .messages({
          'string.empty': 'role required',
          'any.only': 'role can only be PM',
          'any.required': 'role required',
        }),
      rate: Joi.number().min(1).max(1000).required()
        .messages({
          'string.empty': 'Rate required',
          'number.pattern.base': 'Rate should be numbers only',
          'number.min': 'Rate should have a minimum of 1',
          'number.max': 'Rate should have a maximum of 1000',
          'any.required': 'Rate required',
        }),
    }).required().messages({
      'any.required': 'Project must have an employee PM',
    }),
    teamMembers: Joi.array().items(teamMembersValidation),
  });

  const validation = projectsValidations.validate(req.body, { abortEarly: false });

  if (validation.error) {
    return res.status(400).json({
      message: validation.error.details,
      data: undefined,
      error: true,
    });
  }
  return next();
};

export default validateProject;
