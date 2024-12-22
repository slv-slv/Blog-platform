import { Request, Response } from 'express';
import { blogsRepo } from '../data-access/blogs-db-access.js';

export const deleteBlog = (req: Request, res: Response) => {
  const blogId = req.params.id;
  if (!blogsRepo.deleteBlog(blogId)) {
    res.status(404).json({ error: 'Blog not found' });
    return;
  }

  res.status(204).json({ message: 'The blog has been deleted' });
};
