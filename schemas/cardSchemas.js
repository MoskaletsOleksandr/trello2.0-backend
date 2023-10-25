import Joi from 'joi';

const createNewCardSchema = Joi.object({
  title: Joi.string().required().max(24).messages({
    'any.required': 'Missing required title field!',
    'string.empty': "Title can't be empty!",
    'string.base': 'Title must be a string!',
    'string.max': 'Title must not exceed 24 characters!',
  }),
  text: Joi.string().required().max(449).messages({
    'any.required': 'Missing required text field!',
    'string.empty': "Text can't be empty!",
    'string.base': 'Text must be a string!',
    'string.max': 'Text must not exceed 449 characters!',
  }),
  priority: Joi.string()
    .required()
    .valid('without', 'low', 'medium', 'high')
    .messages({
      'any.required': 'Missing required priority field!',
      'string.base': 'Priority must be a string!',
      'any.only': 'Invalid priority value. Must be one of the allowed values.',
    }),
  deadline: Joi.string()
    .regex(/\d{4}-\d{2}-\d{2}/)
    .required()
    .messages({
      'any.required': 'Missing required deadline field!',
      'string.pattern.base': 'Invalid deadline format. Must be YYYY-MM-DD',
      'string.base': 'Deadline must be a string',
    }),
  columnId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.base': 'ColumnId must be a string',
      'string.empty': 'ColumnId cannot be empty',
      'any.required': 'ColumnId is required',
      'string.pattern.base': 'ColumnId must be a valid MongoDB identifier',
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

const updateCardSchema = Joi.object({
  title: Joi.string().required().max(24).messages({
    'any.required': 'Missing required title field!',
    'string.empty': "Title can't be empty!",
    'string.base': 'Title must be a string!',
    'string.max': 'Title must not exceed 24 characters!',
  }),
  text: Joi.string().required().max(449).messages({
    'any.required': 'Missing required text field!',
    'string.empty': "Text can't be empty!",
    'string.base': 'Text must be a string!',
    'string.max': 'Text must not exceed 449 characters!',
  }),
  priority: Joi.string()
    .required()
    .valid('without', 'low', 'medium', 'high')
    .messages({
      'any.required': 'Missing required priority field!',
      'string.base': 'Priority must be a string!',
      'any.only': 'Invalid priority value. Must be one of the allowed values.',
    }),
  deadline: Joi.string()
    .regex(/\d{4}-\d{2}-\d{2}/)
    .required()
    .messages({
      'any.required': 'Missing required deadline field!',
      'string.pattern.base': 'Invalid deadline format. Must be YYYY-MM-DD',
      'string.base': 'Deadline must be a string',
    }),
});

const moveCardSchema = Joi.object({
  newColumnId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.base': 'NewColumnId must be a string',
      'string.empty': 'NewColumnId cannot be empty',
      'any.required': 'NewColumnId is required',
      'string.pattern.base': 'NewColumnId must be a valid MongoDB identifier',
    }),
  newOrderInColumn: Joi.alternatives()
    .try(Joi.number().integer().positive(), Joi.string().valid('last'))
    .required()
    .messages({
      'any.required': 'Missing required newOrderInColumn field!',
      'number.base': 'NewOrder must be a number or "last"',
      'number.integer': 'NewOrder must be an integer',
      'number.positive': 'NewOrder must be a positive number',
      'string.base': 'NewOrder must be a string or "last"',
      'any.only': 'Invalid newOrderInColumn value. Must be a number or "last".',
    }),
});

export default {
  createNewCardSchema,
  updateCardSchema,
  moveCardSchema,
};
