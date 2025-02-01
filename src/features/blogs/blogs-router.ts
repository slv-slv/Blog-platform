import { Router } from 'express';
import { blogsController } from './blogs-controller.js';
import { authController } from '../../auth/auth-controller.js';
import { pagingValidator } from '../../common/validation/paging-params-validation.js';
import { blogsValidator } from './blogs-validation.js';
import { postsValidator } from '../posts/posts-validation.js';

export const blogsRouter = Router();

blogsRouter.get(
  '/',
  blogsValidator.searchNameTerm,
  pagingValidator.blogsSortBy,
  pagingValidator.sortDirection,
  pagingValidator.pageNumber,
  pagingValidator.pageSize,
  blogsController.getAllBlogs,
);

blogsRouter.post(
  '/',
  authController.checkBasicAuth,
  blogsValidator.blogName,
  blogsValidator.blogDescription,
  blogsValidator.blogUrl,
  blogsController.createBlog,
);

blogsRouter.get('/:id', blogsController.findBlog);

blogsRouter.put(
  '/:id',
  authController.checkBasicAuth,
  blogsValidator.blogName,
  blogsValidator.blogDescription,
  blogsValidator.blogUrl,
  blogsController.updateBlog,
);

blogsRouter.delete('/:id', authController.checkBasicAuth, blogsController.deleteBlog);

blogsRouter.get(
  '/:blogId/posts',
  pagingValidator.postsSortBy,
  pagingValidator.sortDirection,
  pagingValidator.pageNumber,
  pagingValidator.pageSize,
  blogsController.getPostsByBlogId,
);

blogsRouter.post(
  '/:blogId/posts',
  authController.checkBasicAuth,
  postsValidator.postTitle,
  postsValidator.postDescription,
  postsValidator.postContent,
  blogsController.createPostForBlog,
);
