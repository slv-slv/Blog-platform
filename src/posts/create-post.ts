import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { formatErrors } from '../validation/format-errors.js';
import { createPostDb } from '../data-access/posts-db-access.js';

export const createPost = (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: formatErrors(errors) });
  }

  const newPost = createPostDb(req.body);
  res.status(201).json({ newPost });
};
