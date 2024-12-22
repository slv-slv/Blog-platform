import { Request, Response } from 'express';
import { postsRepo } from '../data-access/posts-db-access.js';

export const deletePost = (req: Request, res: Response) => {
  const postId = req.params.id;
  if (!postsRepo.deletePost(postId)) {
    res.status(404).json({ error: 'Post not found' });
    return;
  }

  res.status(204).json({ message: 'The post has been deleted' });
};
