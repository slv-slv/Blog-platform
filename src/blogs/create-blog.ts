import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { blogsRepo } from '../data-access/blogs-db-access.js';
import { formatErrors } from '../validation/format-errors.js';

export const createBlog = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errorsMessages: formatErrors(errors) });
    return;
  }

  const newBlog = await blogsRepo.createBlog(req.body);
  res.status(201).json(newBlog);
};
