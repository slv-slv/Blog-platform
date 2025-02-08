import { Router } from 'express';
import { authValidator } from './auth-validation.js';
import { usersValidator } from '../../features/users/users-validation.js';
import { authController } from '../../instances/controllers.js';
import { getValidationResult } from '../../common/middleware/get-validation-result.js';
import { rateLimiter } from '../middleware/rate-limiter.js';
import { checkNoSession } from '../middleware/check-no-session.js';
import { checkCredentials } from '../middleware/check-credentials.js';
import { checkConfirmation } from '../middleware/check-confirmation.js';
import { checkAccessToken } from '../middleware/check-access-token.js';
import { checkRefreshToken } from '../middleware/check-refresh-token.js';
import { generateJwtPair } from '../middleware/generate-jwt-pair.js';

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
  authController.sendJwtPair,
);

authRouter.post('/refresh-token', checkRefreshToken, generateJwtPair, authController.sendJwtPair);

authRouter.post('/logout', checkRefreshToken, authController.logout);

authRouter.get('/me', checkAccessToken, authController.me);

authRouter.post(
  '/registration',
  usersValidator.login,
  usersValidator.newPassword,
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
