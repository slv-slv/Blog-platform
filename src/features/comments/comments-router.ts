import { Router } from 'express';
import { commentsController } from './comments-controller.js';
import { authController } from '../../auth/auth-controller.js';
import { commentsValidator } from './comments-validation.js';

export const commentsRouter = Router();

commentsRouter.get('/:id', commentsController.findComment);

commentsRouter.put(
  '/:commentId',
  authController.verifyJwt,
  commentsValidator.content,
  commentsController.updateComment,
);

commentsRouter.delete('/:commentId', authController.verifyJwt, commentsController.deleteComment);
