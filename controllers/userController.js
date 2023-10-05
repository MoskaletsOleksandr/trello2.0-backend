import { generateTokens, saveToken } from '../helpers/tokenService.js';
import User from '../models/user.js';
import bcrypt from 'bcryptjs';

const { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY } = process.env;

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const candidate = await User.findOne({ email });
    if (candidate) {
      res.status(409).json({ message: 'Email in use' });
      return;
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      ...req.body,
      password: hashPassword,
    });

    const payload = {
      id: newUser._id,
    };
    const tokens = generateTokens(payload);
    await saveToken(newUser._id, tokens.refreshToken);

    console.log('tokens: ', tokens);
    res.cookie('refreshToken', tokens.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    res.status(201).json({
      user: {
        id: newUser._id,
        name,
        email,
      },
      ...tokens,
    });
  } catch (error) {
    console.log(error);
  }
};

export default {
  register,
};
