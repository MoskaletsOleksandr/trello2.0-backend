import express from 'express';
import columnController from '../controllers/columnController.js';
import validateBody from '../decorators/validateBody.js';
import authenticate from '../middlewares/authenticate.js';
import isEmptyBody from '../middlewares/isEmptyBody.js';
import isValidBoardId from '../middlewares/isValidBoardId.js';
import isValidColumnId from '../middlewares/isValidColumnId.js';
import columnSchemas from '../schemas/columnSchemas.js';

const columnsRouter = express.Router();

columnsRouter.get(
  '/:boardId',
  authenticate,
  isValidBoardId,
  columnController.getBoardColumns
);

columnsRouter.post(
  '/',
  authenticate,
  isEmptyBody,
  validateBody(columnSchemas.createNewColumnSchema),
  columnController.createNewColumn
);

columnsRouter.patch(
  '/update/:columnId',
  authenticate,
  isValidColumnId,
  isEmptyBody,
  validateBody(columnSchemas.updateColumnSchema),
  columnController.updateColumnById
);

columnsRouter.patch(
  '/move/:columnId',
  authenticate,
  isValidColumnId,
  isEmptyBody,
  validateBody(columnSchemas.moveColumnSchema),
  columnController.moveColumnById
);

columnsRouter.delete(
  '/:columnId',
  authenticate,
  isValidColumnId,
  columnController.deleteColumnById
);

export default columnsRouter;
