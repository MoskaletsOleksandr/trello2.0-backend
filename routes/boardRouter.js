import express from 'express';
import boardController from '../controllers/boardController.js';
import validateBody from '../decorators/validateBody.js';
import authenticate from '../middlewares/authenticate.js';
import isEmptyBody from '../middlewares/isEmptyBody.js';
import isValidBoardId from '../middlewares/isValidBoardId.js';
import boardSchemas from '../schemas/boardSchemas.js';

const boardsRouter = express.Router();

boardsRouter.get('/', authenticate, boardController.getAllBoards);

boardsRouter.post(
  '/',
  authenticate,
  isEmptyBody,
  validateBody(boardSchemas.createNewBoardSchema),
  boardController.createNewBoard
);

boardsRouter.get(
  '/backgrounds',
  authenticate,
  boardController.getBackgroundsPreviews
);

boardsRouter.get(
  '/:boardId',
  authenticate,
  isValidBoardId,
  boardController.getBoardById
);

boardsRouter.put(
  '/:boardId',
  authenticate,
  isValidBoardId,
  isEmptyBody,
  validateBody(boardSchemas.updateBoardSchema),
  boardController.updateBoardById
);

boardsRouter.delete(
  '/:boardId',
  authenticate,
  isValidBoardId,
  boardController.deleteBoardById
);

export default boardsRouter;
