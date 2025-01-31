import { Router } from 'express';
import { authController } from './auth-controller.js';
import { authValidator } from './auth-validation.js';
import { usersValidator } from '../features/users/users-validation.js';

export const authRouter = Router();

authRouter.post(
  '/login',
  authValidator.loginOrEmail,
  authValidator.authPassword,
  authController.checkPassword,
  authController.issueJwtPair,
);

authRouter.get('/me', authController.verifyJwt, authController.getCurrentUser);

authRouter.post(
  '/registration',
  usersValidator.login,
  usersValidator.newPassword,
  usersValidator.email,
  authController.sendConfirmation,
);

authRouter.post('/registration-email-resending', usersValidator.email, authController.resendConfirmation);

authRouter.post(
  '/registration-confirmation',
  authValidator.confirmationCode,
  authController.confirmRegistration,
);
