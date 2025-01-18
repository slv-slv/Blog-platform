import { Router } from 'express';
import { checkPassword } from '../authorization/check-password.js';
import { authPasswordValidation, loginOrEmailValidation } from '../validation/login-validation.js';

export const authRouter = Router();

authRouter.post('/login', loginOrEmailValidation, authPasswordValidation, checkPassword);
