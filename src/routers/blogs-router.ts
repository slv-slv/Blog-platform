import { Router } from 'express';
import { blogsController } from '../controllers/blogs-controller.js';
import { checkBasicAuth } from '../authorization/basic-auth.js';
import {
  searchNameTermValidation,
  blogNameValidation,
  blogDescriptionValidation,
  blogUrlValidation,
} from '../validation/blogs-validation.js';
import {
  blogsSortByValidation,
  pageNumberValidation,
  pageSizeValidation,
  postsSortByValidation,
  sortDirectionValidation,
} from '../validation/pagination-params-validation.js';
import {
  postContentValidation,
  postDescriptionValidation,
  postTitleValidation,
} from '../validation/posts-validation.js';

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
  checkBasicAuth,
  blogNameValidation,
  blogDescriptionValidation,
  blogUrlValidation,
  blogsController.createBlog,
);

blogsRouter.get('/:id', blogsController.findBlog);

blogsRouter.put(
  '/:id',
  checkBasicAuth,
  blogNameValidation,
  blogDescriptionValidation,
  blogUrlValidation,
  blogsController.updateBlog,
);

blogsRouter.delete('/:id', checkBasicAuth, blogsController.deleteBlog);

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
  checkBasicAuth,
  postTitleValidation,
  postDescriptionValidation,
  postContentValidation,
  blogsController.createPostForBlogId,
);
