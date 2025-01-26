import { Router } from 'express';
import { authController } from './auth-controller.js';
import { authValidator } from './auth-validation.js';

export const authRouter = Router();

authRouter.post(
  '/login',
  authValidator.loginOrEmail,
  authValidator.authPassword,
  authController.checkPassword,
  authController.issueJWT,
);

authRouter.get('/me', authController.verifyJWT, authController.getCurrentUser);
