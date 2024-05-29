import httpStatus from 'http-status';
import { User } from '@prisma/client';

import prisma from '../client';
import userService from './user.service';
import ApiError from '../utils/ApiError';
import {
  encryptPassword,
  isPasswordMatch,
} from '../utils/encryption';
import exclude from '../utils/exclude';

const loginUserWithEmailAndPassword = async (
  email: string,
  password: string,
): Promise<Omit<User, 'password'>> => {
  const user = await userService.getUserByEmail(
    email.trim().toLowerCase(),
    [
      'id',
      'email',
      'name',
      'password',
      'role',
      'createdAt',
      'updatedAt',
    ],
  );

  if (!user || !(await isPasswordMatch(password, user.password))) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      'Incorrect email or password',
    );
  }
  return exclude(user, ['password']);
};

const resetPassword = async (
  userId: number,
  newPassword: string,
): Promise<void> => {
  const user = await prisma.user.findFirst({ where: { id: userId } });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await userService.updateUserById(userId, {
    password: await encryptPassword(newPassword),
  });
};

export default {
  loginUserWithEmailAndPassword,
  resetPassword,
};
