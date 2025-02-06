import { Router } from 'express';
import { commentsValidator } from './comments-validation.js';
import { commentsController } from '../../instances/controllers.js';
import { getValidationResult } from '../../common/middleware/get-validation-result.js';
import { checkAccessToken } from '../../security/middleware/check-access-token.js';

export const commentsRouter = Router();

commentsRouter.get('/:id', commentsController.findComment);

commentsRouter.put(
  '/:commentId',
  checkAccessToken,
  commentsValidator.content,
  getValidationResult,
  commentsController.updateComment,
);

commentsRouter.delete('/:commentId', checkAccessToken, commentsController.deleteComment);
