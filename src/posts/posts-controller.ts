import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { formatErrors } from '../helpers/format-errors.js';
import { postsViewModelRepo } from '../posts/posts-view-model-repo.js';
import { postsService } from '../posts/posts-service.js';
import { getPagingParams } from '../helpers/get-paging-params.js';

export const postsController = {
  getAllPosts: async (req: Request, res: Response) => {
    const paginationParams = getPagingParams(req);
    const posts = await postsViewModelRepo.getPosts(paginationParams);
    res.status(200).json(posts);
  },

  findPost: async (req: Request, res: Response) => {
    const id = req.params.id;
    const foundPost = await postsViewModelRepo.findPost(id);
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

    const { title, shortDescription, content, blogId } = req.body;
    const newPost = await postsService.createPost(title, shortDescription, content, blogId);
    res.status(201).json(newPost);
  },

  updatePost: async (req: Request, res: Response) => {
    const errors = validationResult(req);
    console.log(formatErrors(errors));
    if (!errors.isEmpty()) {
      res.status(400).json({ errorsMessages: formatErrors(errors) });
      return;
    }

    const id = req.params.id;
    const { title, shortDescription, content } = req.body;
    const postFound = await postsService.updatePost(id, title, shortDescription, content);
    if (!postFound) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    res.status(204).end();
  },

  deletePost: async (req: Request, res: Response) => {
    const id = req.params.id;
    const isDeleted = await postsService.deletePost(id);
    if (!isDeleted) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }
    res.status(204).end();
  },
};
