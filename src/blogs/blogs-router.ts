import { Router } from 'express';
import { getBlogs } from './get-blogs.js';
import { findBlog } from './find-blog.js';
import { createBlog } from './create-blog.js';
import { updateBlog } from './update-blog.js';
import { deleteBlog } from './delete-blog.js';
import { blogDescriptionValidation, blogNameValidation, blogUrlValidation } from './blogs-validation.js';

export const blogsRouter = Router();

blogsRouter.get('/', getBlogs);
blogsRouter.get('/:id', findBlog);
blogsRouter.post('/', blogNameValidation, blogDescriptionValidation, blogUrlValidation, createBlog);
blogsRouter.put('/:id', blogNameValidation, blogDescriptionValidation, blogUrlValidation, updateBlog);
blogsRouter.delete('/:id', deleteBlog);
