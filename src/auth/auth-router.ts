import { Router } from 'express';
import { authController } from './auth-controller.js';
import { authValidator } from './auth-validation.js';
import { usersValidator } from '../features/users/users-validation.js';

export const authRouter = Router();

authRouter.post(
  '/login',
  authValidator.loginOrEmail,
  authValidator.authPassword,
  authController.verifyPassword,
  authController.issueJwtPair,
);

authRouter.post('/refresh-token', authController.verifyRefreshJwt, authController.issueJwtPair);

authRouter.post('/logout', authController.verifyRefreshJwt, authController.logout);

authRouter.get('/me', authController.verifyAccessJwt, authController.getCurrentUser);

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
