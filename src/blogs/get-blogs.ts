import { Request, Response } from 'express';
import { blogsRepo } from '../data-access/blogs-db-access.js';

export const getBlogs = (req: Request, res: Response) => {
  const blogs = blogsRepo.getBlogs();
  res.status(200).json(blogs);
};
