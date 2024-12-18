import { body, query, Result, ValidationError } from 'express-validator';
import { ErrorType } from '../types/error-types.js';

export const blogIdValidation = query('id').isInt({ min: 1 }).withMessage('Invalid blog ID');

export const blogNameValidation = body('name')
  .exists()
  .withMessage('Name is required')
  .trim()
  .notEmpty()
  .withMessage('Name must not be empty')
  .isString()
  .withMessage('Name must be a string')
  .isLength({ max: 15 })
  .withMessage('Name must not be more than 15 characters');

export const blogDescriptionValidation = body('name')
  .exists()
  .withMessage('Description is required')
  .trim()
  .notEmpty()
  .withMessage('Description must not be empty')
  .isString()
  .withMessage('Description must be a string')
  .isLength({ max: 500 })
  .withMessage('Description must not be more than 15 characters');

export const blogUrlValidation = body('name')
  .exists()
  .withMessage('URL is required')
  .trim()
  .notEmpty()
  .withMessage('URL must not be empty')
  .isString()
  .withMessage('URL must be a string')
  .isURL()
  .withMessage('URL must be a valid URL')
  .isLength({ max: 100 })
  .withMessage('URL must not be more than 100 characters');

export const formatErrors = (errors: Result<ValidationError>): ErrorType[] => {
  return errors.array({ onlyFirstError: true }).map((err) => ({
    message: err.msg,
    // field: err.param,
  }));
};
