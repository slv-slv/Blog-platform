import { Router } from 'express';
import { authController } from './auth-controller.js';
import { authPasswordValidation, loginOrEmailValidation } from './auth-validation.js';

export const authRouter = Router();

authRouter.post(
  '/login',
  loginOrEmailValidation,
  authPasswordValidation,
  authController.checkPassword,
  authController.issueJWT,
);

authRouter.get('/me', authController.verifyJWT, authController.getCurrentUser);
