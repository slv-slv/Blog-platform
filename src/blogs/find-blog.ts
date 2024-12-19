import { Request, Response } from 'express';
import { findBlogDb } from '../data-access/blogs-db-access.js';

export const findBlog = (req: Request, res: Response) => {
  const blogId = Number(req.query.id);
  const foundBlog = findBlogDb(blogId);
  if (!foundBlog) {
    res.status(404).json({ error: 'Blog not found' });
    return;
  }
  res.status(200).json(foundBlog);
};
