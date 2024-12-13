import { Request, Response } from 'express';
import { findBlogDb } from '../data-access/blogs-db-access.js';
import { blogsDB } from '../db/blogs-db.js';
import { checkAuth } from '../authorization/authorization.js';

export const deleteBlog = (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !checkAuth(authHeader)) {
    res.status(401).json({ error: 'unsuccessful authorization' });
  }

  const blogId = Number(req.query.id);
  if (!findBlogDb(blogId)) {
    res.status(404).json({ error: 'Blog not found' });
  }

  const blogIndex = blogsDB.findIndex((blog) => blog.id === blogId);
  blogsDB.splice(blogIndex, 1);
  res.status(204).json({ message: 'The blog has been deleted' });
};
