import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/users.js';
import { env } from '../utils/env.js';
import { SessionsCollection } from '../db/models/sessions.js';

export async function registerUser(payload) {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (user !== null) {
    throw createHttpError(409, 'Email already in use');
  }
  payload.password = await bcrypt.hash(payload.password, Number(env('SALT')));
  return UsersCollection.create(payload);
}
// ================================================
export async function loginUser(email, password) {
  const user = await UsersCollection.findOne({ email });
  if (user === null) {
    throw createHttpError(404, 'User not found');
  }
  const isPassword = await bcrypt.compare(password, user.password);
  if (!isPassword) {
    throw createHttpError(401, 'Email or password is incorrect');
  }
  await SessionsCollection.deleteOne({ userId: user._id });
  return await SessionsCollection.create({
    userId: user._id,
    accessToken: randomBytes(30).toString('base64'),
    refreshToken: randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
}
// ================================================
export async function logoutUser(sessionId) {
  await SessionsCollection.deleteOne({ _id: sessionId });
}
// ================================================
export async function refreshSession(sessionId, refreshToken) {
  const session = await SessionsCollection.findById(sessionId);

  if (session === null) {
    throw createHttpError(401, 'Session not found');
  }

  if (session.refreshToken !== refreshToken) {
    throw createHttpError(401, 'Session not found');
  }
  if (session.refreshTokenValidUntil < new Date()) {
    throw createHttpError(401, 'Refresh token is expired');
  }
  await SessionsCollection.deleteOne({ _id: session._id });
  return SessionsCollection.create({
    userId: session.userId,
    accessToken: randomBytes(30).toString('base64'),
    refreshToken: randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
}
