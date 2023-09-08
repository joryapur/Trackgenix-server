import joi from 'joi';

const validateTimesheet = (req, res, next) => {
  const validations = joi.object({
    date: joi.date().iso().required().messages({
      'date.base': 'Date is format in invalid',
      'date.format': 'Date is required',
      'any.required': 'Date is required',
    }),
    description: joi.string().required().min(3).max(150)
      .messages({
        'string.empty': 'Description is required',
        'string.min': 'Description should have a minimum length of 3 characters',
        'string.max': 'Description should have a maximum length of 150 characters',
        'any.required': 'Description is required',
      }),
    task: joi.string().required().messages({
      'string.empty': 'Task is required',
    }),
    employee: joi.string().required().messages({
      'string.empty': 'Employee is required',
    }),
    project: joi.string().required().messages({
      'string.empty': 'Project is required',
    }),
    hours: joi.number().min(1).max(12).required()
      .messages({
        'hours.empty': 'Hours is required',
        'number.min': 'Minimum 1 hour',
        'number.max': 'Maximum 12 hours',
        'any.required': 'Hours is required',
      }),
  });
  const validate = validations.validate(req.body, { abortEarly: false });
  if (validate.error) {
    return res.status(400).json({
      message: validate.error.details,
      error: true,
      data: undefined,
    });
  }
  return next();
};

export default validateTimesheet;
