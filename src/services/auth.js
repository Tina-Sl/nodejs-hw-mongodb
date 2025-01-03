import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/users.js';
import { SessionsCollection } from '../db/models/sessions.js';
import { env } from '../utils/env.js';
// ===============================================
import { sendMail } from '../utils/sendMail.js';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';
import { TEMPLATES_DIR } from '../constants/index.js';

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
  console.log(session);
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
// ================================================
export async function requestResetToken(email) {
  const user = await UsersCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const resetToken = jwt.sign(
    { sub: user._id, email: user.email },
    env('JWT_SECRET'),
    {
      expiresIn: '5m',
    },
  );

  const resetPasswordTemplate = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );
  const templateSource = (await fs.readFile(resetPasswordTemplate)).toString();
  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${env('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });
  await sendMail({
    from: env('SMTP_FROM'),
    to: email,
    subject: 'Reset your password',
    html,
  }).catch((error) => {
    console.error('Email sending error:', error);
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  });
}
// ================================================
export async function resetPassword(newPassword, token) {
  let decoded;
  try {
    decoded = jwt.verify(token, env('JWT_SECRET'));
  } catch (error) {
    if (
      error.name === 'JsonWebTokenError' ||
      error.name === 'TokenExpiredError'
    ) {
      throw createHttpError(401, 'Token error');
    }
    throw error;
  }
  const user = await UsersCollection.findOne({
    _id: decoded.sub,
    email: decoded.email,
  });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const hashedPassword = await bcrypt.hash(newPassword, Number(env('SALT')));
  await UsersCollection.findByIdAndUpdate(user._id, {
    password: hashedPassword,
  });
  await SessionsCollection.findOneAndDelete({ userId: user._id });
}
