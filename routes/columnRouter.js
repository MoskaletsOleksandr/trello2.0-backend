import express from 'express';
import columnController from '../controllers/columnController.js';
import authenticate from '../middlewares/authenticate.js';

const columnsRouter = express.Router();

columnsRouter.get('/:boardId', authenticate, columnController.getBoardColumns);

columnsRouter.post('/', authenticate, columnController.createNewColumn);

// boardsRouter.get(
//   '/backgrounds',
//   authenticate,
//   boardController.getBackgroundsPreviews
// );

// boardsRouter.get('/:boardId', authenticate, boardController.getBoardById);

// boardsRouter.put('/:boardId', authenticate, boardController.updateBoardById);

// boardsRouter.delete('/:boardId', authenticate, boardController.deleteBoardById);

export default columnsRouter;
