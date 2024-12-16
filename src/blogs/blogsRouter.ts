import { Router } from 'express';
import { getBlogs } from './getBlogs.js';
import { findBlog } from './findBlog.js';
import { createBlog } from './createBlog.js';
import { updateBlog } from './updateBlog.js';
import { deleteBlog } from './deleteBlog.js';

export const blogsRouter = Router();

blogsRouter.get('/', getBlogs);
blogsRouter.get('/:id', findBlog);
blogsRouter.post('/', createBlog);
blogsRouter.put('/:id', updateBlog);
blogsRouter.delete('/:id', deleteBlog);
