import { Request, Response } from 'express';
import { getPostsDb } from '../data-access/posts-db-access.js';

export const getPosts = (req: Request, res: Response) => {
  const posts = getPostsDb();
  res.status(200).json(posts);
};
