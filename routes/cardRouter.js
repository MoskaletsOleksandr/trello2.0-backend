import express from 'express';
import cardController from '../controllers/cardController.js';
import authenticate from '../middlewares/authenticate.js';

const cardRouter = express.Router();

cardRouter.get('/:boardId', authenticate, cardController.getBoardCards);

cardRouter.post('/', authenticate, cardController.createNewCard);

cardRouter.put('/update/:cardId', authenticate, cardController.updateCardById);

cardRouter.patch('/move/:cardId', authenticate, cardController.moveCardById);

cardRouter.delete('/:cardId', authenticate, cardController.deleteCardById);

export default cardRouter;
