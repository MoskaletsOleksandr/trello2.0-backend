import Joi from 'joi';

const boardCreateNewBoardSchema = Joi.object({
  title: Joi.string().required().max(15).messages({
    'any.required': 'Missing required title field!',
    'string.empty': "Title can't be empty!",
    'string.base': 'Title must be a string!',
    'string.max': 'Title must not exceed 15 characters!',
  }),
  backgroundId: Joi.string()
    .required()
    .valid(
      'background1',
      'background2',
      'background3',
      'background4',
      'background5',
      'background6',
      'background7',
      'background8',
      'background9',
      'background10',
      'background11',
      'background12',
      'background13',
      'background14',
      'background15',
      'null'
    )
    .messages({
      'any.required': 'Missing required backgroundId field!',
      'string.base': 'BackgroundId must be a string!',
      'any.only':
        'Invalid backgroundId value. Must be one of the allowed values.',
    }),
  icon: Joi.string()
    .required()
    .valid(
      'icon-project',
      'icon-star',
      'icon-loading',
      'icon-puzzle-piece',
      'icon-container',
      'icon-lightning',
      'icon-colors',
      'icon-hexagon'
    )
    .messages({
      'any.required': 'Missing required icon field!',
      'string.base': 'Icon must be a string!',
      'any.only': 'Invalid icon value. Must be one of the allowed values.',
    }),
});

const boardUpdateBoardSchema = Joi.object({
  title: Joi.string().required().max(15).messages({
    'any.required': 'Missing required title field!',
    'string.empty': "Title can't be empty!",
    'string.base': 'Title must be a string!',
    'string.max': 'Title must not exceed 15 characters!',
  }),
  backgroundId: Joi.string()
    .required()
    .valid(
      'background1',
      'background2',
      'background3',
      'background4',
      'background5',
      'background6',
      'background7',
      'background8',
      'background9',
      'background10',
      'background11',
      'background12',
      'background13',
      'background14',
      'background15',
      'null'
    )
    .messages({
      'any.required': 'Missing required backgroundId field!',
      'string.base': 'BackgroundId must be a string!',
      'any.only':
        'Invalid backgroundId value. Must be one of the allowed values.',
    }),
  icon: Joi.string()
    .required()
    .valid(
      'icon-project',
      'icon-star',
      'icon-loading',
      'icon-puzzle-piece',
      'icon-container',
      'icon-lightning',
      'icon-colors',
      'icon-hexagon'
    )
    .messages({
      'any.required': 'Missing required icon field!',
      'string.base': 'Icon must be a string!',
      'any.only': 'Invalid icon value. Must be one of the allowed values.',
    }),
});

export default {
  boardCreateNewBoardSchema,
  boardUpdateBoardSchema,
};
