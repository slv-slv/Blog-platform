import { Router } from 'express';
import { postsController } from '../controllers/posts-controller.js';
import { checkBasicAuth } from '../authorization/basic-auth.js';
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
  checkBasicAuth,
  blogExistsValidation,
  postTitleValidation,
  postDescriptionValidation,
  postContentValidation,
  postsController.createPost,
);

postsRouter.put(
  '/:id',
  checkBasicAuth,
  blogExistsValidation,
  postTitleValidation,
  postDescriptionValidation,
  postContentValidation,
  postsController.updatePost,
);

postsRouter.delete('/:id', checkBasicAuth, postsController.deletePost);
