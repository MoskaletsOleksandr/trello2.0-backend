import express from 'express';
import boardController from '../controllers/boardController.js';
import authenticate from '../middlewares/authenticate.js';

const boardsRouter = express.Router();

boardsRouter.get('/', authenticate, boardController.getAllBoards);

boardsRouter.post('/', authenticate, boardController.createNewBoard);

boardsRouter.get(
  '/backgrounds',
  authenticate,
  boardController.getBackgroundsPreviews
);

boardsRouter.get('/:boardId', authenticate, boardController.getBoardById);

boardsRouter.put('/:boardId', authenticate, boardController.updateBoardById);

boardsRouter.delete('/:boardId', authenticate, boardController.deleteBoardById);

export default boardsRouter;
