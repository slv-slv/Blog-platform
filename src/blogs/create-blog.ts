import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { createBlogDb } from '../data-access/blogs-db-access.js';
import { formatErrors } from '../validation/format-errors.js';

export const createBlog = (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: formatErrors(errors) });
  }

  const newBlog = createBlogDb(req.body);
  res.status(201).json({ newBlog });
};
