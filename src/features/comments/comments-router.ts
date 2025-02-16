import { Router } from 'express';
import { commentsValidator } from './comments-validation.js';
import { getValidationResult } from '../../common/middleware/get-validation-result.js';
import { checkAccessToken } from '../../security/middleware/check-access-token.js';
import { container } from '../../ioc/container.js';
import { CommentsController } from './comments-controller.js';

export const commentsRouter = Router();
const commentsController = container.get(CommentsController);

commentsRouter.get('/:id', commentsController.findComment.bind(commentsController));

commentsRouter.put(
  '/:commentId',
  checkAccessToken,
  commentsValidator.content,
  getValidationResult,
  commentsController.updateComment.bind(commentsController),
);

commentsRouter.delete(
  '/:commentId',
  checkAccessToken,
  commentsController.deleteComment.bind(commentsController),
);
