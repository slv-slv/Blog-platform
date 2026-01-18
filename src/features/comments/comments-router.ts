import { Router } from 'express';
import type { Router as RouterType } from 'express';
import { commentsValidator } from './comments-validation.js';
import { getValidationResult } from '../../common/middleware/get-validation-result.js';
import { checkAccessToken } from '../../security/middleware/check-access-token.js';
import { container } from '../../ioc/container.js';
import { CommentsController } from './comments-controller.js';
import { extractUserId } from '../../security/middleware/extract-user-id.js';
import { likeStatusValidator } from '../likes/validation/like-status-validator.js';

export const commentsRouter: RouterType = Router();
const commentsController = container.get(CommentsController);

commentsRouter.get('/:id', extractUserId, commentsController.findComment.bind(commentsController));

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

commentsRouter.put(
  '/:commentId/like-status',
  checkAccessToken,
  likeStatusValidator.likeStatus,
  getValidationResult,
  commentsController.setLikeStatus.bind(commentsController),
);
