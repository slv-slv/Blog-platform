import { Router } from 'express';
import { authController } from './auth-controller.js';
import { authValidators } from './auth-validation.js';

export const authRouter = Router();

authRouter.post(
  '/login',
  authValidators.loginOrEmail,
  authValidators.authPassword,
  authController.checkPassword,
  authController.issueJWT,
);

authRouter.get('/me', authController.verifyJWT, authController.getCurrentUser);
