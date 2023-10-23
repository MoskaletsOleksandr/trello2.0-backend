import express from 'express';
import userController from '../controllers/userController.js';
import authenticate from '../middlewares/authenticate.js';
import extractDeviceId from '../middlewares/extractDeviceId.js';
import uploadCloud from '../middlewares/uploadCloud.js';
import passport from '../middlewares/google-authenticate.js';

const userRouter = express.Router();

userRouter.post('/register', userController.register);

userRouter.post('/login', userController.login);

userRouter.post('/logout', extractDeviceId, userController.logout);

userRouter.get(
  '/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

userRouter.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  userController.googleAuth
);

userRouter.get('/refresh', extractDeviceId, userController.refresh);

userRouter.put(
  '/update',
  authenticate,
  uploadCloud.single('avatar'),
  userController.updateUser
);

userRouter.patch('/theme', authenticate, userController.updateTheme);

userRouter.patch('/board', authenticate, userController.updateCurrentBoardId);

userRouter.post('/letter', authenticate, userController.sendLetter);

userRouter.get('/wakeUp', userController.wakeUpBackend);

export default userRouter;
