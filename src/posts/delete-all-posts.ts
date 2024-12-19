import { Request, Response } from 'express';
import { deleteAllPostsDb } from '../data-access/posts-db-access.js';

export const deleteAllPosts = (req: Request, res: Response) => {
  deleteAllPostsDb();
  res.status(204).json({ message: 'All posts have been deleted' });
};
