import { Router } from 'express';
import { blogsController } from '../controllers/blogs-controller.js';
import { checkAuth } from '../authorization/authorization.js';
import { blogDescriptionValidation, blogNameValidation, blogUrlValidation } from '../validation/blogs-validation.js';
import {
  blogsSortByValidation,
  pageNumberValidation,
  pageSizeValidation,
  postsSortByValidation,
  searchNameTermValidation,
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
  checkAuth,
  blogNameValidation,
  blogDescriptionValidation,
  blogUrlValidation,
  blogsController.createBlog,
);

blogsRouter.get('/:id', blogsController.findBlog);

blogsRouter.put(
  '/:id',
  checkAuth,
  blogNameValidation,
  blogDescriptionValidation,
  blogUrlValidation,
  blogsController.updateBlog,
);

blogsRouter.delete('/:id', checkAuth, blogsController.deleteBlog);

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
  checkAuth,
  postTitleValidation,
  postDescriptionValidation,
  postContentValidation,
  blogsController.createPostForBlogId,
);
