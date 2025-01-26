import { Router } from 'express';
import { postsController } from './posts-controller.js';
import { authController } from '../../auth/auth-controller.js';
import { postsValidator } from './posts-validation.js';
import { pagingValidator } from '../../common/validation/paging-params-validation.js';
import { commentsValidator } from '../comments/comments-validation.js';

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
  authController.basicAuth,
  postsValidator.blogExists,
  postsValidator.postTitle,
  postsValidator.postDescription,
  postsValidator.postContent,
  postsController.createPost,
);

postsRouter.put(
  '/:id',
  authController.basicAuth,
  postsValidator.blogExists,
  postsValidator.postTitle,
  postsValidator.postDescription,
  postsValidator.postContent,
  postsController.updatePost,
);

postsRouter.delete('/:id', authController.basicAuth, postsController.deletePost);

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
  authController.verifyJWT,
  commentsValidator.content,
  postsController.createComment,
);
