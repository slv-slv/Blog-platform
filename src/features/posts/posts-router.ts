import { Router } from 'express';
import type { Router as RouterType } from 'express';
import { postsValidator } from './posts-validation.js';
import { pagingValidator } from '../../common/validation/paging-params-validation.js';
import { commentsValidator } from '../comments/comments-validation.js';
import { getValidationResult } from '../../common/middleware/get-validation-result.js';
import { basicAuth } from '../../security/middleware/basic-auth.js';
import { checkAccessToken } from '../../security/middleware/check-access-token.js';
import { container } from '../../ioc/container.js';
import { PostsController } from './posts-controller.js';
import { extractUserId } from '../../security/middleware/extract-user-id.js';
import { likeStatusValidator } from '../likes/validation/like-status-validator.js';
import { extractPagingParams } from '../../common/middleware/extract-paging-params.js';

export const postsRouter: RouterType = Router();
const postsController = container.get(PostsController);

postsRouter.get(
  '/',
  extractUserId,
  pagingValidator.postsSortBy,
  pagingValidator.sortDirection,
  pagingValidator.pageNumber,
  pagingValidator.pageSize,
  extractPagingParams,
  postsController.getAllPosts.bind(postsController),
);

postsRouter.get('/:id', extractUserId, postsController.findPost.bind(postsController));

postsRouter.post(
  '/',
  basicAuth,
  postsValidator.blogExists,
  postsValidator.postTitle,
  postsValidator.postDescription,
  postsValidator.postContent,
  getValidationResult,
  postsController.createPost.bind(postsController),
);

postsRouter.put(
  '/:id',
  basicAuth,
  postsValidator.blogExists,
  postsValidator.postTitle,
  postsValidator.postDescription,
  postsValidator.postContent,
  getValidationResult,
  postsController.updatePost.bind(postsController),
);

postsRouter.delete('/:id', basicAuth, postsController.deletePost.bind(postsController));

postsRouter.get(
  '/:postId/comments',
  extractUserId,
  pagingValidator.commentsSortBy,
  pagingValidator.sortDirection,
  pagingValidator.pageNumber,
  pagingValidator.pageSize,
  extractPagingParams,
  postsController.getCommentsForPost.bind(postsController),
);

postsRouter.post(
  '/:postId/comments',
  checkAccessToken,
  commentsValidator.content,
  getValidationResult,
  postsController.createComment.bind(postsController),
);

postsRouter.put(
  '/:postId/like-status',
  checkAccessToken,
  likeStatusValidator.likeStatus,
  getValidationResult,
  postsController.setLikeStatus.bind(postsController),
);
