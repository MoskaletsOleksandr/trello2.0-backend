import express from 'express';
import userController from '../controllers/userController.js';
import authenticate from '../middlewares/authenticate.js';
import extractDeviceId from '../middlewares/extractDeviceId.js';

const userRouter = express.Router();

userRouter.post('/register', userController.register);

userRouter.post('/login', userController.login);

userRouter.post('/logout', extractDeviceId, userController.logout);

userRouter.get('/refresh', extractDeviceId, userController.refresh);

userRouter.patch('/theme', authenticate, userController.updateTheme);

userRouter.patch('/board', authenticate, userController.updateCurrentBoardId);

userRouter.get('/wakeUp', userController.wakeUpBackend);

export default userRouter;
