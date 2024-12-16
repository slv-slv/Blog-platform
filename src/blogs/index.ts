import { Router } from 'express';

export const blogsRouter = Router();

blogsRouter.get('/', getBlogs);
blogsRouter.get('/:id', findBlog);
blogsRouter.post('/', createBlog);
blogsRouter.put('/:id', updateBlog);
blogsRouter.delete('/:id', deleteBlog);
