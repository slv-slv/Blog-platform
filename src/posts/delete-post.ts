import { Request, Response } from 'express';
import { deletePostDb } from '../data-access/posts-db-access.js';

export const deletePost = (req: Request, res: Response) => {
  const postId = Number(req.query.id);
  if (!deletePostDb(postId)) {
    res.status(404).json({ error: 'Post not found' });
    return;
  }

  res.status(204).json({ message: 'The post has been deleted' });
};
