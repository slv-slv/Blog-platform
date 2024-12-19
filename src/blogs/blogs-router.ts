import { Router } from 'express';
import { getBlogs } from './get-blogs.js';
import { findBlog } from './find-blog.js';
import { createBlog } from './create-blog.js';
import { updateBlog } from './update-blog.js';
import { deleteBlog } from './delete-blog.js';
import { deleteAllBlogs } from './delete-all-blogs.js';
import { checkAuth } from '../authorization/authorization.js';
import { blogDescriptionValidation, blogNameValidation, blogUrlValidation } from '../validation/blogs-validation.js';

export const blogsRouter = Router();

blogsRouter.get('/', getBlogs);
blogsRouter.get('/:id', findBlog);
blogsRouter.post('/', checkAuth, blogNameValidation, blogDescriptionValidation, blogUrlValidation, createBlog);
blogsRouter.put('/:id', checkAuth, blogNameValidation, blogDescriptionValidation, blogUrlValidation, updateBlog);
blogsRouter.delete('/:id', checkAuth, deleteBlog);
blogsRouter.delete('/testing/all-data', deleteAllBlogs);
