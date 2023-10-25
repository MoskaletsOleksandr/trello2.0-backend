import { isValidObjectId } from 'mongoose';
import HttpError from '../helpers/HttpError.js';

const isValidBoardId = (req, res, next) => {
  const { boardId } = req.params;
  if (!isValidObjectId(boardId)) {
    return next(HttpError(404, `${boardId} is not a valid id`));
  }
  next();
};

export default isValidBoardId;
