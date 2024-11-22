import createHttpError from 'http-errors';

export function notFoundHandler(req, res, next) {
  const err = createHttpError(404, 'Route not found');
  return res
    .status(err.statusCode)
    .send({ status: err.statusCode, message: err.message });
}
