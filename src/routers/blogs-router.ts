import { Router } from 'express';
import { blogsController } from '../controllers/blogs-controller.js';
import { checkAuth } from '../authorization/authorization.js';
import { blogDescriptionValidation, blogNameValidation, blogUrlValidation } from '../validation/blogs-validation.js';

export const blogsRouter = Router();

blogsRouter.get('/', blogsController.getBlogs);

blogsRouter.get('/:id', blogsController.findBlog);

blogsRouter.post(
  '/',
  checkAuth,
  blogNameValidation,
  blogDescriptionValidation,
  blogUrlValidation,
  blogsController.createBlog,
);

blogsRouter.put(
  '/:id',
  checkAuth,
  blogNameValidation,
  blogDescriptionValidation,
  blogUrlValidation,
  blogsController.updateBlog,
);

blogsRouter.delete('/:id', checkAuth, blogsController.deleteBlog);
