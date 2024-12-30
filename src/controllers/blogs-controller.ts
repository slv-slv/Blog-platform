import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { blogsRepo } from '../data-access/blogs-repository.js';
import { formatErrors } from '../validation/format-errors.js';

export const blogsController = {
  getBlogs: async (req: Request, res: Response) => {
    const blogs = await blogsRepo.getBlogs();
    res.status(200).json(blogs);
  },

  findBlog: async (req: Request, res: Response) => {
    const blogId = req.params.id;
    const foundBlog = await blogsRepo.findBlog(blogId);
    if (!foundBlog) {
      res.status(404).json({ error: 'Blog not found' });
      return;
    }
    res.status(200).json(foundBlog);
  },

  createBlog: async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errorsMessages: formatErrors(errors) });
      return;
    }

    const newBlog = await blogsRepo.createBlog(req.body);
    res.status(201).json(newBlog);
  },

  updateBlog: async (req: Request, res: Response) => {
    const blogId = req.params.id;
    const blogFound = await blogsRepo.findBlog(blogId);
    if (!blogFound) {
      res.status(404).json({ error: 'Blog not found' });
      return;
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errorsMessages: formatErrors(errors) });
      return;
    }

    await blogsRepo.updateBlog(blogId, req.body);
    res.status(204).end();
  },

  deleteBlog: async (req: Request, res: Response) => {
    const blogId = req.params.id;
    const isDeleted = await blogsRepo.deleteBlog(blogId);
    if (!isDeleted) {
      res.status(404).json({ error: 'Blog not found' });
      return;
    }
    res.status(204).end();
  },
};
