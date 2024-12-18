import { Router } from 'express';
import { getBlogs } from './get-blogs.js';
import { findBlog } from './find-blog.js';
import { createBlog } from './create-blog.js';
import { updateBlog } from './update-blog.js';
import { deleteBlog } from './delete-blog.js';

export const blogsRouter = Router();

blogsRouter.get('/', getBlogs);
blogsRouter.get('/:id', findBlog);
blogsRouter.post('/', createBlog);
blogsRouter.put('/:id', updateBlog);
blogsRouter.delete('/:id', deleteBlog);
