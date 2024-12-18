import { Request, Response } from 'express';
import { getBlogsDb } from '../data-access/blogs-db-access.js';

export const getBlogs = (req: Request, res: Response) => {
  const blogs = getBlogsDb();
  res.status(200).json(blogs);
};
