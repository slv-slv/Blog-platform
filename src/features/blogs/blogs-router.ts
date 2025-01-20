import { Router } from 'express';
import { blogsController } from './blogs-controller.js';
import { authController } from '../../auth/auth-controller.js';
import {
  searchNameTermValidation,
  blogNameValidation,
  blogDescriptionValidation,
  blogUrlValidation,
} from './blogs-validation.js';
import {
  blogsSortByValidation,
  pageNumberValidation,
  pageSizeValidation,
  postsSortByValidation,
  sortDirectionValidation,
} from '../../common/validation/paging-params-validation.js';
import { postContentValidation, postDescriptionValidation, postTitleValidation } from '../posts/posts-validation.js';

export const blogsRouter = Router();

blogsRouter.get(
  '/',
  searchNameTermValidation,
  blogsSortByValidation,
  sortDirectionValidation,
  pageNumberValidation,
  pageSizeValidation,
  blogsController.getAllBlogs,
);

blogsRouter.post(
  '/',
  authController.basicAuth,
  blogNameValidation,
  blogDescriptionValidation,
  blogUrlValidation,
  blogsController.createBlog,
);

blogsRouter.get('/:id', blogsController.findBlog);

blogsRouter.put(
  '/:id',
  authController.basicAuth,
  blogNameValidation,
  blogDescriptionValidation,
  blogUrlValidation,
  blogsController.updateBlog,
);

blogsRouter.delete('/:id', authController.basicAuth, blogsController.deleteBlog);

blogsRouter.get(
  '/:blogId/posts',
  postsSortByValidation,
  sortDirectionValidation,
  pageNumberValidation,
  pageSizeValidation,
  blogsController.getPostsByBlogId,
);

blogsRouter.post(
  '/:blogId/posts',
  authController.basicAuth,
  postTitleValidation,
  postDescriptionValidation,
  postContentValidation,
  blogsController.createPostForBlogId,
);
