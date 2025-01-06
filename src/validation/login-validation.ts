import { body, query } from 'express-validator';

export const loginOrEmailValidation = body('loginOrEmail')
  .exists()
  .withMessage('Login or email is required')
  .isString()
  .withMessage('Login or email must be a string')
  .trim()
  .notEmpty()
  .withMessage('Login or email must not be empty');

export const authPasswordValidation = body('password')
  .exists()
  .withMessage('Password is required')
  .isString()
  .withMessage('Password must be a string')
  .trim()
  .notEmpty()
  .withMessage('Password must not be empty');
