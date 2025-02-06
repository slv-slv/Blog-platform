import { Router } from 'express';
import { pagingValidator } from '../../common/validation/paging-params-validation.js';
import { blogsValidator } from './blogs-validation.js';
import { postsValidator } from '../posts/posts-validation.js';
import { authController, blogsController } from '../../instances/controllers.js';

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
  authController.verifyBasicAuth,
  blogsValidator.blogName,
  blogsValidator.blogDescription,
  blogsValidator.blogUrl,
  blogsController.createBlog,
);

blogsRouter.get('/:id', blogsController.findBlog);

blogsRouter.put(
  '/:id',
  authController.verifyBasicAuth,
  blogsValidator.blogName,
  blogsValidator.blogDescription,
  blogsValidator.blogUrl,
  blogsController.updateBlog,
);

blogsRouter.delete('/:id', authController.verifyBasicAuth, blogsController.deleteBlog);

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
  authController.verifyBasicAuth,
  postsValidator.postTitle,
  postsValidator.postDescription,
  postsValidator.postContent,
  blogsController.createPostForBlog,
);
