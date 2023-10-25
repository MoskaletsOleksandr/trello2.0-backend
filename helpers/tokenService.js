import jwt from 'jsonwebtoken';
import Token from '../models/token.js';

const { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY } = process.env;

export const createPayload = (id) => ({ id });

export const generateTokens = (payload) => {
  const accessToken = jwt.sign(payload, ACCESS_SECRET_KEY, {
    expiresIn: '3m',
  });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, {
    expiresIn: '30d',
  });

  return {
    accessToken,
    refreshToken,
  };
};

export const saveToken = async (userId, refreshToken, deviceId) => {
  const tokenData = await Token.findOne({ user: userId, deviceId });
  if (tokenData) {
    tokenData.refreshToken = refreshToken;
    return tokenData.save();
  }

  const token = await Token.create({ user: userId, refreshToken, deviceId });
  return token;
};

export const removeTokenByRefreshTokenAndDeviceId = async (
  refreshToken,
  deviceId
) => {
  const tokenData = await Token.deleteOne({ refreshToken, deviceId });
  return tokenData;
};

export const findTokenByRefreshTokenAndDeviceId = async (
  refreshToken,
  deviceId
) => {
  const tokenData = await Token.findOne({ refreshToken, deviceId });
  return tokenData;
};

export const validateAccessToken = (token) => {
  try {
    const userData = jwt.verify(token, ACCESS_SECRET_KEY);
    return userData;
  } catch (error) {
    return null;
  }
};

export const validateRefreshToken = (token) => {
  try {
    const userData = jwt.verify(token, REFRESH_SECRET_KEY);
    return userData;
  } catch (error) {
    return null;
  }
};

export const generateDeviceId = () => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = 48;
  let deviceId = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    deviceId += characters.charAt(randomIndex);
  }
  return deviceId;
};
