import Joi from 'joi';

const validateTask = (req, res, next) => {
  const taskValidation = Joi.object({
    type: Joi.string()
      .pattern(/([A-Za-z]\s*)+/)
      .required()
      .messages({
        'string.empty': 'A type is required',
        'any.only': 'Task type should be a valid Task format',
        'any.required': 'A type is required',
      }),
  });

  const validate = taskValidation.validate(req.body, { abortEarly: false });

  if (validate.error) {
    return res.status(400).json({
      message: validate.error.details,
      data: undefined,
      error: true,
    });
  }
  return next();
};

export default validateTask;
