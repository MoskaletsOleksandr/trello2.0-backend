import { isValidObjectId } from 'mongoose';
import HttpError from '../helpers/HttpError.js';

const isValidCardId = (req, res, next) => {
  const { cardId } = req.params;
  if (!isValidObjectId(cardId)) {
    return next(HttpError(404, `${cardId} is not a valid id`));
  }
  next();
};

export default isValidCardId;
