import HttpError from '../helpers/HttpError.js';

const isEmptyBody = (req, res, next) => {
  const { length } = Object.keys(req.body);
  if (!length) {
    next(HttpError(400, 'Missing fields'));
  }
  next();
};

export default isEmptyBody;
