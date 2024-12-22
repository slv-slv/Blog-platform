import { Request, Response } from 'express';
import { postsRepo } from '../data-access/posts-db-access.js';

export const findPost = (req: Request, res: Response) => {
  const postId = req.params.id;
  const foundPost = postsRepo.findPost(postId);
  if (!foundPost) {
    res.status(404).json({ error: 'Post not found' });
    return;
  }
  res.status(200).json(foundPost);
};
