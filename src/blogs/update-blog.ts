import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { findBlogDb, updateBlogDb } from '../data-access/blogs-db-access.js';
import { formatErrors } from './blogs-validation.js';
import { checkAuth } from '../authorization/authorization.js';

export const updateBlog = (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !checkAuth(authHeader)) {
    res.status(401).json({ error: 'unsuccessful authorization' });
  }

  const blogId = Number(req.query.id);
  if (!findBlogDb(blogId)) {
    res.status(404).json({ error: 'Blog not found' });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: formatErrors(errors) });
  }

  updateBlogDb(blogId, req.body);
  res.status(204).json({ message: 'The blog has been updated' });
};
