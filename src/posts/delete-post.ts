import { Request, Response } from 'express';
import { postsRepo } from '../data-access/posts-db-access.js';

export const deletePost = async (req: Request, res: Response) => {
  const postId = req.params.id;
  const isDeleted = await postsRepo.deletePost(postId);
  if (!isDeleted) {
    res.status(404).json({ error: 'Post not found' });
    return;
  }

  res.status(204).json({ message: 'The post has been deleted' });
};
