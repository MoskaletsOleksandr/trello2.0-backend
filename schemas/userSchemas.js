import Joi from 'joi';

const userRegisterSchema = Joi.object({
  name: Joi.string()
    .pattern(new RegExp('^[A-Za-zА-Яа-я\\s]+$'))
    .required()
    .max(29)
    .messages({
      'any.required': 'Missing required name field!',
      'string.empty': "Name can't be empty!",
      'string.base': 'Name must be a string!',
      'string.max': 'Name must not exceed 29 characters!',
      'string.pattern.base': 'Name can only contain letters',
    }),
  email: Joi.string().email().required().max(49).messages({
    'any.required': 'Missing required email field!',
    'string.empty': "Email can't be empty!",
    'string.email': 'Invalid email format!',
    'string.base': 'Email must be a string!',
    'string.max': 'Email must not exceed 49 characters!',
  }),
  password: Joi.string().required().min(6).max(49).messages({
    'any.required': 'Missing required password field!',
    'string.empty': "Password can't be empty!",
    'string.base': 'Password must be a string!',
    'string.max': 'Password must not exceed 49 characters!',
    'string.min': 'Password must exceed 6 characters!',
  }),
});

const userLoginSchema = Joi.object({
  email: Joi.string().email().required().max(49).messages({
    'any.required': 'Missing required email field!',
    'string.empty': "Email can't be empty!",
    'string.email': 'Invalid email format!',
    'string.base': 'Email must be a string!',
    'string.max': 'Email must not exceed 49 characters!',
  }),
  password: Joi.string().required().min(6).max(49).messages({
    'any.required': 'Missing required password field!',
    'string.empty': "Password can't be empty!",
    'string.base': 'Password must be a string!',
    'string.max': 'Password must not exceed 49 characters!',
    'string.min': 'Password must exceed 6 characters!',
  }),
});

const userUpdateThemeSchema = Joi.object({
  theme: Joi.string().valid('dark', 'light', 'violet').required().messages({
    'any.required': 'Missing required theme field!',
    'string.empty': "Theme can't be empty!",
    'string.base': 'Theme must be a string!',
    'any.only': 'Theme must be one of: dark, light, violet',
  }),
});

const userUpdateCurrentBoardIdSchema = Joi.object({
  boardId: Joi.alternatives(
    Joi.string().regex(/^[0-9a-fA-F]{24}$/),
    Joi.string().valid('null')
  ).messages({
    'string.base': 'BoardId must be a string',
    'string.empty': 'BoardId cannot be empty',
    'any.required': 'BoardId is required',
    'string.pattern.base':
      'BoardId must be a valid MongoDB identifier or "null"',
  }),
});

const userSendLetterSchema = Joi.object({
  email: Joi.string()
    .required()
    .email({ tlds: { allow: false } })
    .max(49)
    .allow('')
    .messages({
      'any.required': 'Missing required email field!',
      'string.email': 'Invalid email format!',
      'string.base': 'Email must be a string!',
      'string.max': 'Email must not exceed 49 characters!',
    }),
  feedback: Joi.string().required().max(499).messages({
    'any.required': 'Missing required feedback field!',
    'string.empty': "Feedback can't be empty!",
    'string.base': 'Feedback must be a string!',
    'string.max': 'Feedback must not exceed 499 characters!',
  }),
});

const userUpdateSchema = Joi.object({
  newEmail: Joi.string().required().email().max(49).messages({
    'any.required': 'Missing required newEmail field!',
    'string.email': 'Invalid email format!',
    'string.base': 'NewEmail must be a string!',
    'string.max': 'NewEmail must not exceed 49 characters!',
  }),
  newName: Joi.string()
    .pattern(new RegExp('^[A-Za-zА-Яа-я\\s]+$'))
    .required()
    .max(29)
    .messages({
      'any.required': 'Missing required newName field!',
      'string.empty': "Name can't be empty!",
      'string.base': 'NewName must be a string!',
      'string.max': 'NewName must not exceed 29 characters!',
      'string.pattern.base': 'NewName can only contain letters',
    }),
  avatar: Joi.any(),
});

export default {
  userRegisterSchema,
  userLoginSchema,
  userUpdateThemeSchema,
  userUpdateCurrentBoardIdSchema,
  userSendLetterSchema,
  userUpdateSchema,
};
