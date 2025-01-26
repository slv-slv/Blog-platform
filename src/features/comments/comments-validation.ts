import { body } from 'express-validator';

export const commentsValidator = {
  content: body('content')
    .exists()
    .withMessage('Content is required')
    .isString()
    .withMessage('Content must be a string')
    .trim()
    .notEmpty()
    .withMessage('Blog ID must not be empty')
    .isLength({ min: 20, max: 300 })
    .withMessage('Content length must be between 20 and 300 characters'),
};
