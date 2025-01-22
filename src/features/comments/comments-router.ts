import { Router } from 'express';
import { commentsController } from './comments-controller.js';
import { authController } from '../../auth/auth-controller.js';
import { contentValidation } from './comments-validation.js';

export const commentsRouter = Router();

commentsRouter.get('/:id', commentsController.findComment);

commentsRouter.put(
  '/:commentId',
  authController.verifyJWT,
  contentValidation,
  commentsController.updateComment,
);

commentsRouter.delete('/:commentId', authController.verifyJWT, commentsController.deleteComment);
