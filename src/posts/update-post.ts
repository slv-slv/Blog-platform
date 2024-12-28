import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { formatErrors } from '../validation/format-errors.js';
import { postsRepo } from '../data-access/posts-db-access.js';

export const updatePost = async (req: Request, res: Response) => {
  const postId = req.params.id;
  if (!postsRepo.findPost(postId)) {
    res.status(404).json({ error: 'Post not found' });
    return;
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errorsMessages: formatErrors(errors) });
    return;
  }

  postsRepo.updatePost(postId, req.body);
  res.status(204).json({ message: 'The post has been updated' });
};
