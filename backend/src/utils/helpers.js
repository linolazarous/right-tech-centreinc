import mongoose from 'mongoose';

export const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

export const sanitizeUser = (user) => {
  const userObj = user.toObject ? user.toObject() : user;
  const { password, twoFASecret, verificationToken, passwordResetToken, ...sanitized } = userObj;
  return sanitized;
};

export const generateRandomString = (length = 10) => {
  return Math.random().toString(36).substring(2, 2 + length);
};
