import { Request, Response } from 'express';
import { postsRepo } from '../data-access/posts-db-access.js';

export const getPosts = async (req: Request, res: Response) => {
  const posts = await postsRepo.getPosts();
  res.status(200).json(posts);
};
