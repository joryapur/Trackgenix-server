import Joi from 'joi';

const validateUser = async (req, res, next) => {
  const userValidation = Joi.object({
    firstName: Joi.string().regex(/^([a-zA-Z]+( [a-zA-Z]+)*)$/).min(2).max(30)
      .required()
      .messages({
        'string.empty': 'first name required',
        'string.pattern.base': 'first name should be letters only',
        'string.min': 'first name should have a minimum length of 2 characters',
        'string.max': 'first name should have a maximum length of 30 characters',
        'any.required': 'first name required',
      }),
    lastName: Joi.string().regex(/^([a-zA-Z]+( [a-zA-Z]+)*)$/).min(2).max(30)
      .required()
      .messages({
        'string.empty': 'last name required',
        'string.pattern.base': 'last name should be letters only',
        'string.min': 'last name should have a minimum length of 2 characters',
        'string.max': 'last name should have a maximum length of 30 characters',
        'any.required': 'last name required',
      }),
    email: Joi.string().email().required()
      .messages({
        'string.empty': 'email required',
        'string.base': 'invalid email format',
        'any.required': 'email required',
      }),
    password: Joi.string().alphanum().min(8).max(50)
      .messages({
        'string.alphanum': 'password must be letters and numbers only',
        'string.min': 'password should have a minimum length of 8 characters',
        'string.max': 'password should have a maximum length of 50 characters',
        'any.required': 'password required',
      }),
    dni: Joi.string().regex(/^\d+$/).min(7).max(11)
      .required()
      .messages({
        'string.empty': 'dni required',
        'string.pattern.base': 'dni must be numbers only',
        'string.min': 'dni should have a minimum length of 7 characters',
        'string.max': 'dni should have a maximum length of 11 characters',
        'any.required': 'dni required',
      }),
    phone: Joi.string().regex(/^\d+$/).min(8).max(15)
      .messages({
        'string.pattern.base': 'phone must be numbers only',
        'string.min': 'phone should have a minimum length of 8 characters',
        'string.max': 'phone should have a maximum length of 15 characters',
      }),
    location: Joi.string().min(3).max(50)
      .messages({
        'string.min': 'location should have a minimum length of 3 characters',
        'string.max': 'location should have a maximum length of 50 characters',
      }),
    firebaseUid: Joi.string().messages({
      'any.required': 'Failed to load user correctly. Verify user ID sent.',
      'string.empty': 'Failed to load user correctly. Verify user ID sent.',
    }),
  });

  const validate = userValidation.validate(req.body, { abortEarly: false });

  if (validate.error) {
    return res.status(400).json({
      message: validate.error.details,
      data: undefined,
      error: true,
    });
  }

  return next();
};

export default validateUser;
