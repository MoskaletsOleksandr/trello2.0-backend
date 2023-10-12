import express from 'express';
import columnController from '../controllers/columnController.js';
import authenticate from '../middlewares/authenticate.js';

const columnsRouter = express.Router();

columnsRouter.get('/:boardId', authenticate, columnController.getBoardColumns);

columnsRouter.post('/', authenticate, columnController.createNewColumn);

columnsRouter.put(
  '/:columnId',
  authenticate,
  columnController.updateColumnById
);

columnsRouter.put('/:columnId', authenticate, columnController.moveColumnById);

columnsRouter.delete(
  '/:columnId',
  authenticate,
  columnController.deleteColumnById
);

export default columnsRouter;
