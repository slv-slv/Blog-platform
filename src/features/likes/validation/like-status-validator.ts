import { body } from 'express-validator';
import { LikeStatus } from '../types/likes-types.js';

export const likeStatusValidator = {
  likeStatus: body('likeStatus')
    .exists()
    .withMessage('Like status is required')
    .isString()
    .withMessage('Like status must be a string')
    .isIn(Object.values(LikeStatus))
    .withMessage('Invalid like status value'),
};
