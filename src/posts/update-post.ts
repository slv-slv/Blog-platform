import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { formatErrors } from '../validation/format-errors.js';
import { findPostDb, updatePostDb } from '../data-access/posts-db-access.js';

export const updatePost = (req: Request, res: Response) => {
  const postId = Number(req.query.id);
  if (!findPostDb(postId)) {
    res.status(404).json({ error: 'Blog not found' });
    return;
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: formatErrors(errors) });
    return;
  }

  updatePostDb(postId, req.body);
  res.status(204).json({ message: 'The post has been updated' });
};
