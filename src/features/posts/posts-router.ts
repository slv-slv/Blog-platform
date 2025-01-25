import { Router } from 'express';
import { postsController } from './posts-controller.js';
import { authController } from '../../auth/auth-controller.js';
import { postValidators } from './posts-validation.js';
import { pagingValidators } from '../../common/validation/paging-params-validation.js';
import { commentValidators } from '../comments/comments-validation.js';

export const postsRouter = Router();

postsRouter.get(
  '/',
  pagingValidators.postsSortBy,
  pagingValidators.sortDirection,
  pagingValidators.pageNumber,
  pagingValidators.pageSize,
  postsController.getAllPosts,
);

postsRouter.get('/:id', postsController.findPost);

postsRouter.post(
  '/',
  authController.basicAuth,
  postValidators.blogExists,
  postValidators.postTitle,
  postValidators.postDescription,
  postValidators.postContent,
  postsController.createPost,
);

postsRouter.put(
  '/:id',
  authController.basicAuth,
  postValidators.blogExists,
  postValidators.postTitle,
  postValidators.postDescription,
  postValidators.postContent,
  postsController.updatePost,
);

postsRouter.delete('/:id', authController.basicAuth, postsController.deletePost);

postsRouter.get(
  '/:postId/comments',
  pagingValidators.commentsSortBy,
  pagingValidators.sortDirection,
  pagingValidators.pageNumber,
  pagingValidators.pageSize,
  postsController.getCommentsForPost,
);

postsRouter.post(
  '/:postId/comments',
  authController.verifyJWT,
  commentValidators.content,
  postsController.createComment,
);
