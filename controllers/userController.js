import {
  createPayload,
  findTokenByRefreshTokenAndDeviceId,
  generateDeviceId,
  generateTokens,
  removeTokenByRefreshTokenAndDeviceId,
  saveToken,
  validateRefreshToken,
} from '../helpers/tokenService.js';
import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import HttpError from '../helpers/HttpError.js';
import ctrlWrapper from '../decorators/ctrlWrapper.js';
import uploadAvatar from '../helpers/uploadAvatar.js';
import sendEmail from '../helpers/sendEmail.js';
import createEmails from '../helpers/createEmails.js';

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
  const deviceId = generateDeviceId();
  await saveToken(newUser._id, tokens.refreshToken, deviceId);

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
    deviceId,
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
  const deviceId = generateDeviceId();
  await saveToken(user._id, tokens.refreshToken, deviceId);

  res.cookie('refreshToken', tokens.refreshToken, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });

  res.status(200).json({
    user,
    deviceId,
    ...tokens,
  });
};

const logout = async (req, res, next) => {
  const { refreshToken } = req.cookies;
  const { deviceId } = req;
  await removeTokenByRefreshTokenAndDeviceId(refreshToken, deviceId);

  res.clearCookie('refreshToken');
  res.status(204).json({ message: 'No content' });
};

const refresh = async (req, res, next) => {
  const errorMessage = 'You tried to authenticate with an invalid token';
  const { refreshToken } = req.cookies;
  const { deviceId } = req;
  if (!refreshToken || !deviceId) {
    throw HttpError(403, errorMessage);
  }

  const userData = validateRefreshToken(refreshToken);
  const tokenInDb = await findTokenByRefreshTokenAndDeviceId(
    refreshToken,
    deviceId
  );
  if (!userData || !tokenInDb) {
    throw HttpError(403, errorMessage);
  }

  const user = await User.findById(userData.id);

  const payload = createPayload(user._id);
  const tokens = generateTokens(payload);
  await saveToken(user._id, tokens.refreshToken, deviceId);

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

const updateUser = async (req, res, next) => {
  const { id } = req.user;
  const { newName, newEmail } = req.body;
  const userToUpdate = await User.findById(id);

  if (!userToUpdate) {
    throw HttpError(
      401,
      `An error occurred while updating user data. User with id ${id} not found`
    );
  }

  const updatedFields = {};
  if (newName && newName !== userToUpdate.name) {
    updatedFields.name = newName;
  }
  if (newEmail && newEmail !== userToUpdate.email) {
    updatedFields.email = newEmail;
  }
  if (req.file) {
    updatedFields.avatarUrl = await uploadAvatar(req, res);
  }

  if (Object.keys(updatedFields).length === 0) {
    throw HttpError(400, 'No fields to update');
  }

  const updatedUser = await User.findByIdAndUpdate(id, updatedFields, {
    new: true,
  });

  res.status(200).json({ user: updatedUser });
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
    throw HttpError(
      401,
      `An error occurred while updating the theme. User with id ${id} not found`
    );
  }

  res.status(200).json({
    id,
    theme,
  });
};

const sendLetter = async (req, res, next) => {
  const { email, feedback } = req.body;

  const emails = createEmails(email, feedback);
  emails.forEach(async (email) => {
    await sendEmail(email);
  });

  res.status(200).json({
    message:
      'Your feedback has been successfully received. You will receive a confirmation email at the provided address.',
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
    throw HttpError(
      401,
      `Error while changing board. User with id ${id} not found`
    );
  }

  res.status(200).json({
    id,
    boardId,
  });
};

const wakeUpBackend = (req, res, next) => {
  res.status(204).json({ message: 'No content' });
};

export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  refresh: ctrlWrapper(refresh),
  updateUser: ctrlWrapper(updateUser),
  updateTheme: ctrlWrapper(updateTheme),
  updateCurrentBoardId: ctrlWrapper(updateCurrentBoardId),
  sendLetter: ctrlWrapper(sendLetter),
  wakeUpBackend: ctrlWrapper(wakeUpBackend),
};
