import Joi from 'joi';

const createNewColumnSchema = Joi.object({
  title: Joi.string().required().max(25).messages({
    'any.required': 'Missing required title field!',
    'string.empty': "Title can't be empty!",
    'string.base': 'Title must be a string!',
    'string.max': 'Title must not exceed 25 characters!',
  }),
  boardId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.base': 'BoardId must be a string',
      'string.empty': 'BoardId cannot be empty',
      'any.required': 'BoardId is required',
      'string.pattern.base': 'BoardId must be a valid MongoDB identifier',
    }),
});

const updateColumnSchema = Joi.object({
  title: Joi.string().required().max(25).messages({
    'any.required': 'Missing required title field!',
    'string.empty': "Title can't be empty!",
    'string.base': 'Title must be a string!',
    'string.max': 'Title must not exceed 25 characters!',
  }),
});

const moveColumnSchema = Joi.object({
  newOrder: Joi.number().integer().positive().required().messages({
    'any.required': 'Missing required newOrder field!',
    'number.base': 'NewOrder must be a number',
    'number.integer': 'NewOrder must be an integer',
    'number.positive': 'NewOrder must be a positive number',
  }),
});

export default {
  createNewColumnSchema,
  updateColumnSchema,
  moveColumnSchema,
};
