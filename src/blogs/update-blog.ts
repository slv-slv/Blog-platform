import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { findBlogDb, updateBlogDb } from '../data-access/blogs-db-access.js';
import { formatErrors } from '../validation/format-errors.js';

export const updateBlog = (req: Request, res: Response) => {
  const blogId = req.params.id;
  if (!findBlogDb(blogId)) {
    res.status(404).json({ error: 'Blog not found' });
    return;
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errorsMessages: formatErrors(errors) });
    return;
  }

  updateBlogDb(blogId, req.body);
  res.status(204).json({ message: 'The blog has been updated' });
};
