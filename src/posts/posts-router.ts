import { Router } from 'express';
import { getPosts } from './get-posts.js';
import { findPost } from './find-post.js';
import { createPost } from './create-post.js';
import { updatePost } from './update-post.js';
import { deletePost } from './delete-post.js';
import { checkAuth } from '../authorization/authorization.js';
import {
  blogExistsValidation,
  postContentValidation,
  postDescriptionValidation,
  postTitleValidation,
} from '../validation/posts-validation.js';

export const postsRouter = Router();

postsRouter.get('/', getPosts);

postsRouter.get('/:id', findPost);

postsRouter.post(
  '/',
  checkAuth,
  blogExistsValidation,
  postTitleValidation,
  postDescriptionValidation,
  postContentValidation,
  createPost,
);

postsRouter.put(
  '/:id',
  checkAuth,
  blogExistsValidation,
  postTitleValidation,
  postDescriptionValidation,
  postContentValidation,
  updatePost,
);

postsRouter.delete('/:id', checkAuth, deletePost);
