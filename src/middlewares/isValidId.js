import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';

export const isValidId =
  (nameId = 'id') =>
  (req, res, next) => {
    const id = req.params[nameId];

    if (!isValidObjectId(id)) {
      return next(createHttpError(400, 'ID is not valid'));
    }
    next();
  };
