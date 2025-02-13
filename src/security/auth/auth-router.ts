import { Router } from 'express';
import { authValidator } from './auth-validation.js';
import { usersValidator } from '../../features/users/users-validation.js';
import { authController } from '../../instances/controllers.js';
import { getValidationResult } from '../../common/middleware/get-validation-result.js';
import { checkNoSession } from '../middleware/check-no-session.js';
import { checkCredentials } from '../middleware/check-credentials.js';
import { checkConfirmation } from '../middleware/check-confirmation.js';
import { checkAccessToken } from '../middleware/check-access-token.js';
import { checkRefreshToken } from '../middleware/check-refresh-token.js';
import { generateJwtPair } from '../middleware/generate-jwt-pair.js';
import { createSession } from '../middleware/create-session.js';
import { checkSession } from '../middleware/check-session.js';
import { rateLimiter } from '../middleware/rate-limiter.js';

export const authRouter = Router();

// authRouter.use(rateLimiter);

authRouter.post(
  '/login',
  checkNoSession,
  authValidator.loginOrEmail,
  authValidator.authPassword,
  getValidationResult,
  checkCredentials,
  checkConfirmation,
  generateJwtPair,
  createSession,
  authController.sendJwtPair,
);

authRouter.post(
  '/refresh-token',
  checkRefreshToken,
  checkSession,
  generateJwtPair,
  createSession,
  authController.sendJwtPair,
);

authRouter.post('/logout', checkRefreshToken, authController.logout);

authRouter.get('/me', checkAccessToken, authController.me);

authRouter.post(
  '/registration',
  usersValidator.login,
  usersValidator.password,
  usersValidator.email,
  getValidationResult,
  authController.registration,
);

authRouter.post(
  '/registration-email-resending',
  usersValidator.email,
  getValidationResult,
  authController.registrationEmailResending,
);

authRouter.post(
  '/registration-confirmation',
  authValidator.confirmationCode,
  getValidationResult,
  authController.registrationConfirmation,
);

authRouter.post(
  '/password-recovery',
  usersValidator.email,
  getValidationResult,
  authController.passwordRecovery,
);

authRouter.post('/new-password', usersValidator.newPassword, getValidationResult, authController.newPassword);
