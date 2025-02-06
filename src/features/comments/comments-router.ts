import { Router } from 'express';
import { commentsValidator } from './comments-validation.js';
import { authController, commentsController } from '../../instances/controllers.js';

export const commentsRouter = Router();

commentsRouter.get('/:id', commentsController.findComment);

commentsRouter.put(
  '/:commentId',
  authController.verifyAccessJwt,
  commentsValidator.content,
  commentsController.updateComment,
);

commentsRouter.delete('/:commentId', authController.verifyAccessJwt, commentsController.deleteComment);
