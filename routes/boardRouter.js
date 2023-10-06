import express from 'express';
import boardController from '../controllers/boardController.js';
import authenticate from '../middlewares/authenticate.js';

const boardsRouter = express.Router();

boardsRouter.get('/', authenticate, boardController.getAllBoards);
boardsRouter.post('/', authenticate, boardController.createNewBoard);

export default boardsRouter;
