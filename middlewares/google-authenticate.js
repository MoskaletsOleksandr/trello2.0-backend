import passport from 'passport';
import { Strategy } from 'passport-google-oauth20';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import { nanoid } from 'nanoid';

const { CLIENT_ID, CLIENT_SECRET, CALLBACK_URL } = process.env;

const googleParams = {
  clientID: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  callbackURL: CALLBACK_URL,
  passReqToCallback: true,
};

const googleCallback = async (
  req,
  accessToken,
  refreshToken,
  profile,
  done
) => {
  try {
    const { email, name, _json } = profile._json;
    const user = await User.findOne({ email });
    if (user) {
      return done(null, user);
    }
    const password = await bcrypt.hash(nanoid(), 10);

    const newUser = await User.create({ email, password, name });
    done(null, newUser);
  } catch (error) {
    done(error, false);
  }
};

const googleStrategy = new Strategy(googleParams, googleCallback);

passport.use('google', googleStrategy);

export default passport;
