import { Router } from 'express';
import { authValidator } from './auth-validation.js';
import { usersValidator } from '../../features/users/users-validation.js';
import { authController, securityController } from '../../instances/controllers.js';

export const authRouter = Router();

authRouter.post(
  '/login',
  securityController.ipThrottler,
  authController.checkNoSession,
  authValidator.loginOrEmail,
  authValidator.authPassword,
  authController.verifyPassword,
  authController.checkConfirmation,
  authController.issueJwtPair,
);

authRouter.post(
  '/refresh-token',
  securityController.ipThrottler,
  authController.verifyRefreshJwt,
  authController.issueJwtPair,
);

authRouter.post(
  '/logout',
  securityController.ipThrottler,
  authController.verifyRefreshJwt,
  authController.logout,
);

authRouter.get(
  '/me',
  securityController.ipThrottler,
  authController.verifyAccessJwt,
  authController.getCurrentUser,
);

authRouter.post(
  '/registration',
  securityController.ipThrottler,
  usersValidator.login,
  usersValidator.newPassword,
  usersValidator.email,
  authController.sendConfirmation,
);

authRouter.post(
  '/registration-email-resending',
  securityController.ipThrottler,
  usersValidator.email,
  authController.resendConfirmation,
);

authRouter.post(
  '/registration-confirmation',
  securityController.ipThrottler,
  authValidator.confirmationCode,
  authController.confirmRegistration,
);
