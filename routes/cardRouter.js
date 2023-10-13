import express from 'express';
import cardController from '../controllers/cardController.js';
import authenticate from '../middlewares/authenticate.js';

const cardRouter = express.Router();

cardRouter.get('/:boardId', authenticate, cardController.getBoardCards);

cardRouter.post('/', authenticate, cardController.createNewCard);

cardRouter.put('/update/:cardId', authenticate, cardController.updateCardById);

// taskRouter.delete(
//   '/:taskId',
//   userValidators.authenticate,
//   taskControllers.deleteTask
// );

// taskRouter.patch(
//   '/:taskId/move',
//   userValidators.authenticate,
//   userValidators.isEmptyBody,
//   taskValidators.moveTask,
//   taskControllers.moveTask
// );

// taskRouter.get(
//   '/:boardId/:priority',
//   userValidators.authenticate,
//   taskControllers.getTasksByPriority
// );

export default cardRouter;
