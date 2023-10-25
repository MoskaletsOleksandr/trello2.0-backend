import express from 'express';
import cardController from '../controllers/cardController.js';
import validateBody from '../decorators/validateBody.js';
import authenticate from '../middlewares/authenticate.js';
import isEmptyBody from '../middlewares/isEmptyBody.js';
import isValidBoardId from '../middlewares/isValidBoardId.js';
import isValidCardId from '../middlewares/isValidCardId.js';
import cardSchemas from '../schemas/cardSchemas.js';

const cardRouter = express.Router();

cardRouter.get(
  '/:boardId',
  authenticate,
  isValidBoardId,
  cardController.getBoardCards
);

cardRouter.post(
  '/',
  authenticate,
  isEmptyBody,
  validateBody(cardSchemas.createNewCardSchema),
  cardController.createNewCard
);

cardRouter.put(
  '/update/:cardId',
  authenticate,
  isValidCardId,
  isEmptyBody,
  validateBody(cardSchemas.updateCardSchema),
  cardController.updateCardById
);

cardRouter.patch(
  '/move/:cardId',
  authenticate,
  isValidCardId,
  isEmptyBody,
  validateBody(cardSchemas.moveCardSchema),
  cardController.moveCardById
);

cardRouter.delete(
  '/:cardId',
  authenticate,
  isValidCardId,
  cardController.deleteCardById
);

export default cardRouter;
