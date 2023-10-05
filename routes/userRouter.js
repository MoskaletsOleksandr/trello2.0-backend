import express from 'express';
import userController from '../controllers/userController.js';
import authenticate from '../middlewares/authenticate.js';

const userRouter = express.Router();

userRouter.post('/register', userController.register);

userRouter.post('/login', userController.login);

userRouter.post('/logout', userController.logout);

userRouter.get('/refresh', userController.refresh);

userRouter.get('/users', authenticate, userController.getUsers);

export default userRouter;