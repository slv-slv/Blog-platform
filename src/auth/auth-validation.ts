import { body } from 'express-validator';

export const authValidator = {
  loginOrEmail: body('loginOrEmail')
    .exists()
    .withMessage('Login or email is required')
    .isString()
    .withMessage('Login or email must be a string')
    .trim()
    .notEmpty()
    .withMessage('Login or email must not be empty'),

  authPassword: body('password')
    .exists()
    .withMessage('Password is required')
    .isString()
    .withMessage('Password must be a string')
    .trim()
    .notEmpty()
    .withMessage('Password must not be empty'),

  confirmationCode: body('code')
    .exists()
    .withMessage('Confirmation code is required')
    .isString()
    .withMessage('Confirmation code must be a string')
    .trim()
    .notEmpty()
    .withMessage('Confirmation code must not be empty'),
};
