import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { formatErrors } from '../validation/format-errors.js';
import { postsRepo } from '../data-access/posts-db-access.js';

export const createPost = (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errorsMessages: formatErrors(errors) });
    return;
  }

  const newPost = postsRepo.createPost(req.body);
  res.status(201).json(newPost);
};
