import { Request, Response } from 'express';
import { postsRepo } from '../data-access/posts-db-access.js';

export const getPosts = (req: Request, res: Response) => {
  const posts = postsRepo.getPosts();
  res.status(200).json(posts);
};
