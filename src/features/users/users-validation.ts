import { body, query } from 'express-validator';

export const usersValidator = {
  searchLoginTerm: query('searchLoginTerm')
    .optional()
    .isString()
    .withMessage('searchLoginTerm must be a string'),

  searchEmailTerm: query('searchEmailTerm')
    .optional()
    .isString()
    .withMessage('searchEmailTerm must be a string'),

  login: body('login')
    .exists()
    .withMessage('Login is required')
    .isString()
    .withMessage('Login must be a string')
    .trim()
    .notEmpty()
    .withMessage('Login must not be empty')
    .isLength({ min: 3, max: 10 })
    .withMessage('Login length must be between 3 and 10 characters')
    .matches('^[a-zA-Z0-9_-]*$')
    .withMessage('Invalid login'),

  password: body('password')
    .exists()
    .withMessage('Password is required')
    .isString()
    .withMessage('Password must be a string')
    .trim()
    .notEmpty()
    .withMessage('Password must not be empty')
    .isLength({ min: 6, max: 20 })
    .withMessage('Password length must be between 6 and 20 characters'),

  newPassword: body('newPassword')
    .exists()
    .withMessage('Password is required')
    .isString()
    .withMessage('Password must be a string')
    .trim()
    .notEmpty()
    .withMessage('Password must not be empty')
    .isLength({ min: 6, max: 20 })
    .withMessage('Password length must be between 6 and 20 characters'),

  email: body('email')
    .exists()
    .withMessage('Email is required')
    .isString()
    .withMessage('Email must be a string')
    .trim()
    .notEmpty()
    .withMessage('Email must not be empty')
    .isEmail()
    .withMessage('Invalid email'),
};
