import createHttpError from 'http-errors';
import { SessionsCollection } from '../db/models/sessions.js';
import { UsersCollection } from '../db/models/users.js';

export async function authenticate(req, res, next) {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    next(createHttpError(401, 'Please provide Authorization header'));
    return;
  }
  const bearer = authHeader.split(' ')[0];
  const accessToken = authHeader.split(' ')[1];
  if (bearer !== 'Bearer' || !accessToken) {
    next(createHttpError(401, 'Auth header should be of type Bearer'));
    return;
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
