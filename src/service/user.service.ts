import { User, Role } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import { Prisma } from '@prisma/client';
import { encryptPassword } from '../utils/encryption';
import prisma from '../client';

const getUserByEmail = async <Key extends keyof User>(
  email: string,
  keys: Key[] = [
    'id',
    'name',
    'email',
    'password',
    'role',
    'createdAt',
    'updatedAt',
  ] as Key[],
): Promise<Pick<User, Key> | null> => {
  return prisma.user.findUnique({
    where: { email },
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
  }) as Promise<Pick<User, Key> | null>;
};

const createUser = async (
  name: string,
  email: string,
  password: string,
  role?: Role,
): Promise<User> => {
  try {
    const createdUser = await prisma.user.create({
      data: {
        email: email.trim().toLowerCase(),
        password: await encryptPassword(password),
        role,
        name,
      },
    });
    return createdUser;
  } catch (error) {
    if (
      (error as Prisma.PrismaClientKnownRequestError).code === 'P2002'
    ) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Email "${email}" already exists`,
      );
    }
    throw error;
  }
};

const getUserById = async <Key extends keyof User>(
  id: number,
  keys: Key[] = [
    'id',
    'name',
    'email',
    'password',
    'role',
    'createdAt',
    'updatedAt',
  ] as Key[],
): Promise<Pick<User, Key> | null> => {
  return prisma.user.findUnique({
    where: { id },
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
  }) as Promise<Pick<User, Key> | null>;
};

const updateUserById = async <Key extends keyof User>(
  userId: number,
  updateBody: Prisma.UserUpdateInput,
  keys: Key[] = ['id', 'email', 'role', 'name'] as Key[],
): Promise<Pick<User, Key> | null> => {
  const user = await getUserById(userId, [
    'id',
    'email',
    'role',
    'name',
  ]);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: updateBody,
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
  });
  return updatedUser as Pick<User, Key> | null;
};

export default {
  getUserByEmail,
  createUser,
  getUserById,
  updateUserById,
};
