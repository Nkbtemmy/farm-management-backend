import express from 'express';
import validate from '../middleware/validate';
import authValidation from '../validation/auth.validation';
import authController from '../controller/auth.controller';
import auth from '../middleware/auth';

const router = express.Router();

router.post(
  '/login',
  validate(authValidation.login),
  authController.login,
);

router.post(
  '/register',
  validate(authValidation.register),
  authController.register,
);

router.patch(
  '/reset-password',
  auth(),
  validate(authValidation.resetPassword),
  authController.resetPassword,
);

export default router;
