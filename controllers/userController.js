import {
  createPayload,
  findToken,
  generateTokens,
  removeToken,
  saveToken,
  validateRefreshToken,
} from '../helpers/tokenService.js';
import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import HttpError from '../helpers/HttpError.js';
import ctrlWrapper from '../decorators/ctrlWrapper.js';

const register = async (req, res, next) => {
  const { name, email, password } = req.body;
  const candidate = await User.findOne({ email });
  if (candidate) {
    throw HttpError(409, 'Email in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ ...req.body, password: hashPassword });

  const payload = createPayload(newUser._id);
  const tokens = generateTokens(payload);
  await saveToken(newUser._id, tokens.refreshToken);

  res.cookie('refreshToken', tokens.refreshToken, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });
  res.status(201).json({
    user: {
      id: newUser._id,
      name,
      email,
    },
    ...tokens,
  });
};

const login = async (req, res, next) => {
  const errorMessage = 'Email or password is wrong';
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, errorMessage);
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, errorMessage);
  }

  const payload = createPayload(user._id);
  const tokens = generateTokens(payload);
  await saveToken(user._id, tokens.refreshToken);

  res.cookie('refreshToken', tokens.refreshToken, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });
  res.status(200).json({
    user,
    ...tokens,
  });
};

const logout = async (req, res, next) => {
  const { refreshToken } = req.cookies;
  await removeToken(refreshToken);

  res.clearCookie('refreshToken');
  res.status(204).json({ message: 'No content' });
};

const refresh = async (req, res, next) => {
  const errorMessage = 'Token invalid';
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    throw HttpError(403, errorMessage);
  }

  const userData = validateRefreshToken(refreshToken);
  const tokenInDb = await findToken(refreshToken);
  if (!userData || !tokenInDb) {
    throw HttpError(403, errorMessage);
  }

  const user = await User.findById(userData.id);

  const payload = createPayload(user._id);
  const tokens = generateTokens(payload);
  await saveToken(user._id, tokens.refreshToken);

  res.cookie('refreshToken', tokens.refreshToken, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });
  res.status(200).json({
    user,
    ...tokens,
  });
};

const updateTheme = async (req, res, next) => {
  const { theme } = req.body;
  const { id } = req.user;
  const user = await User.findByIdAndUpdate(
    id,
    { theme: theme },
    { new: true }
  );

  if (!user) {
    throw HttpError(401, `User with id ${id} not found`);
  }

  res.status(200).json({
    id,
    theme,
  });
};

const updateCurrentBoardId = async (req, res, next) => {
  const { boardId } = req.body;
  const { id } = req.user;
  const user = await User.findByIdAndUpdate(
    id,
    { currentBoardId: boardId },
    { new: true }
  );

  if (!user) {
    throw HttpError(401, `User with id ${id} not found`);
  }

  res.status(200).json({
    id,
    boardId,
  });
};

export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  refresh: ctrlWrapper(refresh),
  updateTheme: ctrlWrapper(updateTheme),
  updateCurrentBoardId: ctrlWrapper(updateCurrentBoardId),
};
