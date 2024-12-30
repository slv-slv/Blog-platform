import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { postsRepo } from '../data-access/posts-repository.js';
import { formatErrors } from '../validation/format-errors.js';

export const postsController = {
  getPosts: async (req: Request, res: Response) => {
    const posts = await postsRepo.getPosts();
    res.status(200).json(posts);
  },

  findPost: async (req: Request, res: Response) => {
    const postId = req.params.id;
    const foundPost = await postsRepo.findPost(postId);
    if (!foundPost) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }
    res.status(200).json(foundPost);
  },

  createPost: async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errorsMessages: formatErrors(errors) });
      return;
    }

    const newPost = await postsRepo.createPost(req.body);
    res.status(201).json(newPost);
  },

  updatePost: async (req: Request, res: Response) => {
    const postId = req.params.id;
    const postFound = await postsRepo.findPost(postId);
    if (!postFound) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    const errors = validationResult(req);
    console.log(formatErrors(errors));
    if (!errors.isEmpty()) {
      res.status(400).json({ errorsMessages: formatErrors(errors) });
      return;
    }

    await postsRepo.updatePost(postId, req.body);
    res.status(204).end();
  },

  deletePost: async (req: Request, res: Response) => {
    const postId = req.params.id;
    const isDeleted = await postsRepo.deletePost(postId);
    if (!isDeleted) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    res.status(204).end();
  },
};
