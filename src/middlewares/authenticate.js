import createHttpError from 'http-errors';
import { SessionsCollection } from '../db/models/sessions.js';
import { UsersCollection } from '../db/models/users.js';

export async function authenticate(req, res, next) {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    return next(createHttpError(401, 'Please provide Authorization header'));
  }
  const [bearer, accessToken] = authHeader.split(' ', 2);

  if (bearer !== 'Bearer' || !accessToken) {
    return next(createHttpError(401, 'Auth header should be of type Bearer'));
  }
  const session = await SessionsCollection.findOne({
    accessToken: accessToken,
  });
  if (!session) {
    return next(createHttpError(401, 'Session not found'));
  }
  if (session.accessTokenValidUntil < new Date()) {
    return next(createHttpError(401, 'Access token expired'));
  }
  const user = await UsersCollection.findById(session.userId);
  if (!user) {
    return next(createHttpError(401, 'User not found'));
  }
  req.user = user;
  next();
}
