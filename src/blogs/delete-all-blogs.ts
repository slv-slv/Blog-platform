import { Request, Response } from 'express';
import { deleteAllBlogsDb } from '../data-access/blogs-db-access.js';

export const deleteAllBlogs = (req: Request, res: Response) => {
  deleteAllBlogsDb();
  res.status(204).json({ message: 'All blogs have been deleted' });
};
