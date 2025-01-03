import { Router } from 'express';
import { postsController } from '../controllers/posts-controller.js';
import { checkAuth } from '../authorization/authorization.js';
import {
  blogExistsValidation,
  postContentValidation,
  postDescriptionValidation,
  postTitleValidation,
} from '../validation/posts-validation.js';
import {
  pageNumberValidation,
  pageSizeValidation,
  postsSortByValidation,
  sortDirectionValidation,
} from '../validation/pagination-params-validation.js';

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
  checkAuth,
  blogExistsValidation,
  postTitleValidation,
  postDescriptionValidation,
  postContentValidation,
  postsController.createPost,
);

postsRouter.put(
  '/:id',
  checkAuth,
  blogExistsValidation,
  postTitleValidation,
  postDescriptionValidation,
  postContentValidation,
  postsController.updatePost,
);

postsRouter.delete('/:id', checkAuth, postsController.deletePost);
