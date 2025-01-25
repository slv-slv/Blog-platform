import { Router } from 'express';
import { blogsController } from './blogs-controller.js';
import { authController } from '../../auth/auth-controller.js';
import { pagingValidators } from '../../common/validation/paging-params-validation.js';
import { blogValidators } from './blogs-validation.js';
import { postValidators } from '../posts/posts-validation.js';

export const blogsRouter = Router();

blogsRouter.get(
  '/',
  blogValidators.searchNameTerm,
  pagingValidators.blogsSortBy,
  pagingValidators.sortDirection,
  pagingValidators.pageNumber,
  pagingValidators.pageSize,
  blogsController.getAllBlogs,
);

blogsRouter.post(
  '/',
  authController.basicAuth,
  blogValidators.blogName,
  blogValidators.blogDescription,
  blogValidators.blogUrl,
  blogsController.createBlog,
);

blogsRouter.get('/:id', blogsController.findBlog);

blogsRouter.put(
  '/:id',
  authController.basicAuth,
  blogValidators.blogName,
  blogValidators.blogDescription,
  blogValidators.blogUrl,
  blogsController.updateBlog,
);

blogsRouter.delete('/:id', authController.basicAuth, blogsController.deleteBlog);

blogsRouter.get(
  '/:blogId/posts',
  pagingValidators.postsSortBy,
  pagingValidators.sortDirection,
  pagingValidators.pageNumber,
  pagingValidators.pageSize,
  blogsController.getPostsByBlogId,
);

blogsRouter.post(
  '/:blogId/posts',
  authController.basicAuth,
  postValidators.postTitle,
  postValidators.postDescription,
  postValidators.postContent,
  blogsController.createPostForBlog,
);
