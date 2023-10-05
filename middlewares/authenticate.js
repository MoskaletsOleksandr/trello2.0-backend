import ctrlWrapper from '../decorators/ctrlWrapper.js';
import HttpError from '../helpers/HttpError.js';
import User from '../models/user.js';
import { validateAccessToken } from '../helpers/tokenService.js';

const authenticate = async (req, res, next) => {
  const errorMessage = 'Not authorized';
  const { authorization = '' } = req.headers;
  const [bearer, token] = authorization.split(' ');
  if (bearer !== 'Bearer' || !token) {
    throw HttpError(401, errorMessage);
  }

  const userData = validateAccessToken(token);
  if (!userData) {
    throw HttpError(401, errorMessage);
  }

  try {
    const searchedUser = await User.findById(userData.id);
    if (!searchedUser) {
      throw HttpError(401, errorMessage);
    }
    req.user = searchedUser;
    next();
  } catch (error) {
    throw HttpError(401, errorMessage);
  }
};

export default ctrlWrapper(authenticate);
