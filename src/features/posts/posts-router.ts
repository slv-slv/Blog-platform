import { Router } from 'express';
import { postsValidator } from './posts-validation.js';
import { pagingValidator } from '../../common/validation/paging-params-validation.js';
import { commentsValidator } from '../comments/comments-validation.js';
import { authController, postsController } from '../../instances/controllers.js';

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
  authController.verifyBasicAuth,
  postsValidator.blogExists,
  postsValidator.postTitle,
  postsValidator.postDescription,
  postsValidator.postContent,
  postsController.createPost,
);

postsRouter.put(
  '/:id',
  authController.verifyBasicAuth,
  postsValidator.blogExists,
  postsValidator.postTitle,
  postsValidator.postDescription,
  postsValidator.postContent,
  postsController.updatePost,
);

postsRouter.delete('/:id', authController.verifyBasicAuth, postsController.deletePost);

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
  authController.verifyAccessJwt,
  commentsValidator.content,
  postsController.createComment,
);
