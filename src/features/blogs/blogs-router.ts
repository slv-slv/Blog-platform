import { Router } from 'express';
import { pagingValidator } from '../../common/validation/paging-params-validation.js';
import { blogsValidator } from './blogs-validation.js';
import { postsValidator } from '../posts/posts-validation.js';
import { blogsController } from '../../instances/controllers.js';
import { getValidationResult } from '../../common/middleware/get-validation-result.js';
import { basicAuth } from '../../security/middleware/basic-auth.js';

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
