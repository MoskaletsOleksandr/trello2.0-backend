import { isValidObjectId } from 'mongoose';
import HttpError from '../helpers/HttpError.js';

const isValidColumnId = (req, res, next) => {
  const { columnId } = req.params;
  if (!isValidObjectId(columnId)) {
    return next(HttpError(404, `${columnId} is not a valid id`));
  }
  next();
};

export default isValidColumnId;
