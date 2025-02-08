import { Router } from 'express';
import { postsValidator } from './posts-validation.js';
import { pagingValidator } from '../../common/validation/paging-params-validation.js';
import { commentsValidator } from '../comments/comments-validation.js';
import { postsController } from '../../instances/controllers.js';
import { getValidationResult } from '../../common/middleware/get-validation-result.js';
import { basicAuth } from '../../security/middleware/basic-auth.js';
import { checkAccessToken } from '../../security/middleware/check-access-token.js';

export const postsRouter = Router();

postsRouter.get(
  '/',
  pagingValidator.postsSortBy,
  pagingValidator.sortDirection,
  pagingValidator.pageNumber,
  pagingValidator.pageSize,
  postsController.getAllPosts,
);

postsRouter.get('/:id', postsController.findPost);

postsRouter.post(
  '/',
  basicAuth,
  postsValidator.blogExists,
  postsValidator.postTitle,
  postsValidator.postDescription,
  postsValidator.postContent,
  getValidationResult,
  postsController.createPost,
);

postsRouter.put(
  '/:id',
  basicAuth,
  postsValidator.blogExists,
  postsValidator.postTitle,
  postsValidator.postDescription,
  postsValidator.postContent,
  getValidationResult,
  postsController.updatePost,
);

postsRouter.delete('/:id', basicAuth, postsController.deletePost);

postsRouter.get(
  '/:postId/comments',
  pagingValidator.commentsSortBy,
  pagingValidator.sortDirection,
  pagingValidator.pageNumber,
  pagingValidator.pageSize,
  postsController.getCommentsForPost,
);

postsRouter.post(
  '/:postId/comments',
  checkAccessToken,
  commentsValidator.content,
  getValidationResult,
  postsController.createComment,
);
