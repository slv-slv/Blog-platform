import { Router } from 'express';
import { pagingValidator } from '../../common/validation/paging-params-validation.js';
import { blogsValidator } from './blogs-validation.js';
import { postsValidator } from '../posts/posts-validation.js';
import { getValidationResult } from '../../common/middleware/get-validation-result.js';
import { basicAuth } from '../../security/middleware/basic-auth.js';
import { container } from '../../ioc/container.js';
import { BlogsController } from './blogs-controller.js';
import { getUserId } from '../../security/middleware/get-user-id.js';
import { getPagingParams } from '../../common/middleware/get-paging-params.js';

export const blogsRouter = Router();
const blogsController = container.get(BlogsController);

blogsRouter.get(
  '/',
  blogsValidator.searchNameTerm,
  pagingValidator.blogsSortBy,
  pagingValidator.sortDirection,
  pagingValidator.pageNumber,
  pagingValidator.pageSize,
  getPagingParams,
  blogsController.getAllBlogs.bind(blogsController),
);

blogsRouter.post(
  '/',
  basicAuth,
  blogsValidator.blogName,
  blogsValidator.blogDescription,
  blogsValidator.blogUrl,
  getValidationResult,
  blogsController.createBlog.bind(blogsController),
);

blogsRouter.get('/:id', blogsController.findBlog.bind(blogsController));

blogsRouter.put(
  '/:id',
  basicAuth,
  blogsValidator.blogName,
  blogsValidator.blogDescription,
  blogsValidator.blogUrl,
  getValidationResult,
  blogsController.updateBlog.bind(blogsController),
);

blogsRouter.delete('/:id', basicAuth, blogsController.deleteBlog.bind(blogsController));

blogsRouter.get(
  '/:blogId/posts',
  getUserId,
  pagingValidator.postsSortBy,
  pagingValidator.sortDirection,
  pagingValidator.pageNumber,
  pagingValidator.pageSize,
  getPagingParams,
  blogsController.getPostsByBlogId.bind(blogsController),
);

blogsRouter.post(
  '/:blogId/posts',
  basicAuth,
  postsValidator.postTitle,
  postsValidator.postDescription,
  postsValidator.postContent,
  getValidationResult,
  blogsController.createPostForBlog.bind(blogsController),
);
