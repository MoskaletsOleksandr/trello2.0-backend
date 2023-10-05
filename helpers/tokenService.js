import jwt from 'jsonwebtoken';
import Token from '../models/token.js';

const { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY } = process.env;

export const createPayload = (id) => ({ id });

export const generateTokens = (payload) => {
  const accessToken = jwt.sign(payload, ACCESS_SECRET_KEY, {
    expiresIn: '2m',
  });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, {
    expiresIn: '30d',
  });

  return {
    accessToken,
    refreshToken,
  };
};

export const saveToken = async (userId, refreshToken) => {
  const tokenData = await Token.findOne({ user: userId });
  if (tokenData) {
    tokenData.refreshToken = refreshToken;
    return tokenData.save();
  }

  const token = await Token.create({ user: userId, refreshToken });
  return token;
};

export const removeToken = async (refreshToken) => {
  const tokenData = await Token.deleteOne({ refreshToken });
  return tokenData;
};

export const findToken = async (refreshToken) => {
  const tokenData = await Token.findOne({ refreshToken });
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
