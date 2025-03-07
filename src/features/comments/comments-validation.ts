import { body } from 'express-validator';
import { LikeStatus } from '../likes/comments/comment-likes-types.js';

export const commentsValidator = {
  content: body('content')
    .exists()
    .withMessage('Content is required')
    .isString()
    .withMessage('Content must be a string')
    .trim()
    .notEmpty()
    .withMessage('Content must not be empty')
    .isLength({ min: 20, max: 300 })
    .withMessage('Content length must be between 20 and 300 characters'),

  likeStatus: body('likeStatus')
    .exists()
    .withMessage('Like status is required')
    .isString()
    .withMessage('Like status must be a string')
    .isIn(Object.values(LikeStatus))
    .withMessage('Invalid like status value'),
};
