import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { formatErrors } from '../../common/utils/format-errors.js';
import { postsViewModelRepo } from './posts-view-model-repo.js';
import { postsService } from './posts-service.js';
import { getPagingParams } from '../../common/utils/get-paging-params.js';
import { HTTP_STATUS } from '../../common/types/http-status-codes.js';
import { commentsViewModelRepo } from '../comments/comments-view-model-repo.js';
import { usersViewModelRepo } from '../users/users-view-model-repo.js';
import { commentsService } from '../comments/comments-service.js';
import { httpCodeByResult } from '../../common/types/result-status-codes.js';

export const postsController = {
  getAllPosts: async (req: Request, res: Response) => {
    const pagingParams = getPagingParams(req);
    const posts = await postsViewModelRepo.getPosts(pagingParams);
    res.status(HTTP_STATUS.OK_200).json(posts);
  },

  findPost: async (req: Request, res: Response) => {
    const id = req.params.id;
    const post = await postsViewModelRepo.findPost(id);
    if (!post) {
      res.status(HTTP_STATUS.NOT_FOUND_404).json({ error: 'Post not found' });
      return;
    }
    res.status(HTTP_STATUS.OK_200).json(post);
  },

  createPost: async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(HTTP_STATUS.BAD_REQUEST_400).json({ errorsMessages: formatErrors(errors) });
      return;
    }

    const { title, shortDescription, content, blogId } = req.body;
    const newPost = await postsService.createPost(title, shortDescription, content, blogId);
    res.status(HTTP_STATUS.CREATED_201).json(newPost);
  },

  updatePost: async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(HTTP_STATUS.BAD_REQUEST_400).json({ errorsMessages: formatErrors(errors) });
      return;
    }

    const id = req.params.id;
    const { title, shortDescription, content } = req.body;
    const isUpdated = await postsService.updatePost(id, title, shortDescription, content);
    if (!isUpdated) {
      res.status(HTTP_STATUS.NOT_FOUND_404).json({ error: 'Post not found' });
      return;
    }

    res.status(HTTP_STATUS.NO_CONTENT_204).end();
  },

  deletePost: async (req: Request, res: Response) => {
    const id = req.params.id;
    const isDeleted = await postsService.deletePost(id);
    if (!isDeleted) {
      res.status(HTTP_STATUS.NOT_FOUND_404).json({ error: 'Post not found' });
      return;
    }
    res.status(HTTP_STATUS.NO_CONTENT_204).end();
  },

  getCommentsForPost: async (req: Request, res: Response) => {
    const postId = req.params.postId;
    const post = await postsViewModelRepo.findPost(postId);
    if (!post) {
      res.status(HTTP_STATUS.NOT_FOUND_404).json({ error: 'Post not found' });
      return;
    }
    const pagingParams = getPagingParams(req);
    const comments = await commentsViewModelRepo.getCommentsForPost(postId, pagingParams);
    res.status(HTTP_STATUS.OK_200).json(comments);
  },

  createComment: async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(HTTP_STATUS.BAD_REQUEST_400).json({ errorsMessages: formatErrors(errors) });
      return;
    }

    const postId = req.params.postId;
    const post = await postsViewModelRepo.findPost(postId);
    if (!post) {
      res.status(HTTP_STATUS.NOT_FOUND_404).json({ error: 'Post not found' });
      return;
    }

    const content = req.body.content;

    // Как-то по другому извлекать userId из access-токена?
    const jwtPayload = res.locals.jwtPayload;
    const userId = jwtPayload.userId;
    const user = await usersViewModelRepo.getCurrentUser(userId);

    const result = await commentsService.createComment(postId, content, user);
    res.status(httpCodeByResult(result.status)).json(result.data);
  },
};
