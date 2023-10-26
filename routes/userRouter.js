import express from 'express';
import userController from '../controllers/userController.js';
import authenticate from '../middlewares/authenticate.js';
import extractDeviceId from '../middlewares/extractDeviceId.js';
import uploadCloud from '../middlewares/uploadCloud.js';
import passport from '../middlewares/googleAuthenticate.js';
import validateBody from '../decorators/validateBody.js';
import userSchemas from '../schemas/userSchemas.js';
import isEmptyBody from '../middlewares/isEmptyBody.js';
import checkFileType from '../middlewares/checkFileType.js';

const userRouter = express.Router();

userRouter.post(
  '/register',
  isEmptyBody,
  validateBody(userSchemas.userRegisterSchema),
  userController.register
);

userRouter.post(
  '/login',
  isEmptyBody,
  validateBody(userSchemas.userLoginSchema),
  userController.login
);

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
  checkFileType(['image/jpeg', 'image/png']),
  isEmptyBody,
  validateBody(userSchemas.userUpdateSchema),
  userController.updateUser
);

userRouter.patch(
  '/theme',
  authenticate,
  isEmptyBody,
  validateBody(userSchemas.userUpdateThemeSchema),
  userController.updateTheme
);

userRouter.patch(
  '/board',
  authenticate,
  isEmptyBody,
  validateBody(userSchemas.userUpdateCurrentBoardIdSchema),
  userController.updateCurrentBoardId
);

userRouter.post(
  '/letter',
  authenticate,
  isEmptyBody,
  validateBody(userSchemas.userSendLetterSchema),
  userController.sendLetter
);

userRouter.get('/wakeUp', userController.wakeUpBackend);

export default userRouter;
