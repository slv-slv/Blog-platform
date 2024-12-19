import { Request, Response } from 'express';
import { deleteBlogDb } from '../data-access/blogs-db-access.js';

export const deleteBlog = (req: Request, res: Response) => {
  const blogId = Number(req.params.id);
  if (!deleteBlogDb(blogId)) {
    res.status(404).json({ error: 'Blog not found' });
    return;
  }

  res.status(204).json({ message: 'The blog has been deleted' });
};
