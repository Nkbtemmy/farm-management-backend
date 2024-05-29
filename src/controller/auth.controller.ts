import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import { User } from '@prisma/client';
import authService from '../service/auth.service';
import tokenService from '../service/token.service';
import userService from '../service/user.service';

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(
    email,
    password,
  );
  const token = tokenService.generateToken(user.id);
  res.status(httpStatus.OK).send({ user, token });
});

const register = catchAsync(async (req, res) => {
  const { email, password, name } = req.body;
  const { password: _, ...user } = await userService.createUser(
    name,
    email,
    password,
    'USER',
  );
  const token = tokenService.generateToken(user.id);
  res.status(httpStatus.CREATED).send({ user, token });
});

const resetPassword = catchAsync(async (req, res) => {
  const { newPassword } = req.body;
  const { id: userId } = req.user as User;
  await authService.resetPassword(userId, newPassword);
  res
    .status(httpStatus.OK)
    .send({ message: 'Password reset successfully' });
});

export default {
  login,
  resetPassword,
  register,
};
