import { Router } from 'express';
import { pagingValidator } from '../../common/validation/paging-params-validation.js';
import { blogsValidator } from './blogs-validation.js';
import { postsValidator } from '../posts/posts-validation.js';
import { getValidationResult } from '../../common/middleware/get-validation-result.js';
import { basicAuth } from '../../security/middleware/basic-auth.js';
import { container } from '../../ioc/container.js';
import { BlogsController } from './blogs-controller.js';

export const blogsRouter = Router();
const blogsController = container.get(BlogsController);

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
  basicAuth,
  blogsValidator.blogName,
  blogsValidator.blogDescription,
  blogsValidator.blogUrl,
  getValidationResult,
  blogsController.createBlog,
);

blogsRouter.get('/:id', blogsController.findBlog);

blogsRouter.put(
  '/:id',
  basicAuth,
  blogsValidator.blogName,
  blogsValidator.blogDescription,
  blogsValidator.blogUrl,
  getValidationResult,
  blogsController.updateBlog,
);

blogsRouter.delete('/:id', basicAuth, blogsController.deleteBlog);

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
  basicAuth,
  postsValidator.postTitle,
  postsValidator.postDescription,
  postsValidator.postContent,
  getValidationResult,
  blogsController.createPostForBlog,
);
