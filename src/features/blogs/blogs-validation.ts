import { body, query } from 'express-validator';

export const blogsValidator = {
  searchNameTerm: query('searchNameTerm')
    .optional()
    .isString()
    .withMessage('searchNameTerm must be a string'),

  blogName: body('name')
    .exists()
    .withMessage('Name is required')
    .isString()
    .withMessage('Name must be a string')
    .trim()
    .notEmpty()
    .withMessage('Name must not be empty')
    .isLength({ max: 15 })
    .withMessage('Name must not be more than 15 characters'),

  blogDescription: body('description')
    .exists()
    .withMessage('Description is required')
    .isString()
    .withMessage('Description must be a string')
    .trim()
    .notEmpty()
    .withMessage('Description must not be empty')
    .isLength({ max: 500 })
    .withMessage('Description must not be more than 500 characters'),

  blogUrl: body('websiteUrl')
    .exists()
    .withMessage('URL is required')
    .isString()
    .withMessage('URL must be a string')
    .trim()
    .notEmpty()
    .withMessage('URL must not be empty')
    .isURL()
    .withMessage('URL must be a valid URL')
    .isLength({ max: 100 })
    .withMessage('URL must not be more than 100 characters'),
};
