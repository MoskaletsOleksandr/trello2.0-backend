import jwt from 'jsonwebtoken';
import Token from '../models/token.js';

const { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY } = process.env;

export const generateTokens = (payload) => {
  console.log(
    'ACCESS_SECRET_KEY, REFRESH_SECRET_KEY:',
    ACCESS_SECRET_KEY,
    REFRESH_SECRET_KEY
  );

  const accessToken = jwt.sign(payload, ACCESS_SECRET_KEY, {
    expiresIn: '30m',
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
