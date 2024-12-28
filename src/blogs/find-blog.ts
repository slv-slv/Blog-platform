import { Request, Response } from 'express';
import { blogsRepo } from '../data-access/blogs-db-access.js';

export const findBlog = async (req: Request, res: Response) => {
  const blogId = req.params.id;
  const foundBlog = await blogsRepo.findBlog(blogId);
  if (!foundBlog) {
    res.status(404).json({ error: 'Blog not found' });
    return;
  }
  res.status(200).json(foundBlog);
};
