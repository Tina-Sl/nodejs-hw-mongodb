import { HttpError } from 'http-errors';

export function errorHandler(err, req, res, next) {
  if (err instanceof HttpError) {
    return res.status(err.statusCode).send({
      status: err.statusCode,
      message: err.name,
      data: err.message,
    });
  }
  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    data: err.message,
  });
}
