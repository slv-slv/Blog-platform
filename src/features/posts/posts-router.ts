import { Router } from 'express';
import { postsController } from './posts-controller.js';
import { authController } from '../../auth/auth-controller.js';
import {
  blogExistsValidation,
  postContentValidation,
  postDescriptionValidation,
  postTitleValidation,
} from './posts-validation.js';
import {
  pageNumberValidation,
  pageSizeValidation,
  postsSortByValidation,
  sortDirectionValidation,
} from '../../common/validation/paging-params-validation.js';

export const postsRouter = Router();

postsRouter.get(
  '/',
  postsSortByValidation,
  sortDirectionValidation,
  pageNumberValidation,
  pageSizeValidation,
  postsController.getAllPosts,
);

postsRouter.get('/:id', postsController.findPost);

postsRouter.post(
  '/',
  authController.basicAuth,
  blogExistsValidation,
  postTitleValidation,
  postDescriptionValidation,
  postContentValidation,
  postsController.createPost,
);

postsRouter.put(
  '/:id',
  authController.basicAuth,
  blogExistsValidation,
  postTitleValidation,
  postDescriptionValidation,
  postContentValidation,
  postsController.updatePost,
);

postsRouter.delete('/:id', authController.basicAuth, postsController.deletePost);
