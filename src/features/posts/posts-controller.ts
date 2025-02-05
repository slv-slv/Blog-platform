import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { formatErrors } from '../../common/utils/format-errors.js';
import { getPagingParams } from '../../common/utils/get-paging-params.js';
import { HTTP_STATUS } from '../../common/types/http-status-codes.js';
import { httpCodeByResult } from '../../common/types/result-status-codes.js';
import { commentsQueryRepo, postsQueryRepo, usersQueryRepo } from '../../instances/repositories.js';
import { commentsService, postsService } from '../../instances/services.js';

class PostsController {
  async getAllPosts(req: Request, res: Response) {
    const pagingParams = getPagingParams(req);
    const posts = await postsQueryRepo.getPosts(pagingParams);
    res.status(HTTP_STATUS.OK_200).json(posts);
  }

  async findPost(req: Request, res: Response) {
    const id = req.params.id;
    const post = await postsQueryRepo.findPost(id);
    if (!post) {
      res.status(HTTP_STATUS.NOT_FOUND_404).json({ error: 'Post not found' });
      return;
    }
    res.status(HTTP_STATUS.OK_200).json(post);
  }

  async createPost(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(HTTP_STATUS.BAD_REQUEST_400).json({ errorsMessages: formatErrors(errors) });
      return;
    }

    const { title, shortDescription, content, blogId } = req.body;
    const newPost = await postsService.createPost(title, shortDescription, content, blogId);
    res.status(HTTP_STATUS.CREATED_201).json(newPost);
  }

  async updatePost(req: Request, res: Response) {
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
  }

  async deletePost(req: Request, res: Response) {
    const id = req.params.id;
    const isDeleted = await postsService.deletePost(id);
    if (!isDeleted) {
      res.status(HTTP_STATUS.NOT_FOUND_404).json({ error: 'Post not found' });
      return;
    }
    res.status(HTTP_STATUS.NO_CONTENT_204).end();
  }

  async getCommentsForPost(req: Request, res: Response) {
    const postId = req.params.postId;
    const post = await postsQueryRepo.findPost(postId);
    if (!post) {
      res.status(HTTP_STATUS.NOT_FOUND_404).json({ error: 'Post not found' });
      return;
    }
    const pagingParams = getPagingParams(req);
    const comments = await commentsQueryRepo.getCommentsForPost(postId, pagingParams);
    res.status(HTTP_STATUS.OK_200).json(comments);
  }

  async createComment(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(HTTP_STATUS.BAD_REQUEST_400).json({ errorsMessages: formatErrors(errors) });
      return;
    }

    const postId = req.params.postId;
    const post = await postsQueryRepo.findPost(postId);
    if (!post) {
      res.status(HTTP_STATUS.NOT_FOUND_404).json({ error: 'Post not found' });
      return;
    }

    const content = req.body.content;

    // Как-то по другому извлекать userId из access-токена?
    const jwtPayload = res.locals.jwtPayload;
    const userId = jwtPayload.userId;
    const user = await usersQueryRepo.getCurrentUser(userId);
    if (!user) {
      res.status(HTTP_STATUS.UNAUTHORIZED_401).json({ error: 'User not found' });
      return;
    }
    const result = await commentsService.createComment(postId, content, user);
    res.status(httpCodeByResult(result.status)).json(result.data);
  }
}

export const postsController = new PostsController();
