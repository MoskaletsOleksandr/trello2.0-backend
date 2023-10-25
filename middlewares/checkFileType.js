import HttpError from '../helpers/HttpError.js';

const checkFileType = (allowedTypes) => (req, res, next) => {
  if (req.file) {
    if (!allowedTypes.includes(req.file.mimetype)) {
      next(HttpError(400, 'Invalid file type. Only images are allowed'));
    }
  }

  next();
};

export default checkFileType;
