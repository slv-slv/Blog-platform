import { Request, Response } from 'express';
import { findPostDb } from '../data-access/posts-db-access.js';

export const findPost = (req: Request, res: Response) => {
  const postId = Number(req.query.id);
  const foundPost = findPostDb(postId);
  if (!foundPost) {
    res.status(404).json({ error: 'Post not found' });
  }
  res.status(200).json(foundPost);
};
