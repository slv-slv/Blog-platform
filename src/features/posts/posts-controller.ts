import { Request, Response } from 'express';
import { getPagingParams } from '../../common/utils/get-paging-params.js';
import { HTTP_STATUS } from '../../common/types/http-status-codes.js';
import { httpCodeByResult, RESULT_STATUS } from '../../common/types/result-status-codes.js';
import { inject, injectable } from 'inversify';
import { PostsRepo } from './posts-repo.js';
import { PostsQueryRepo } from './posts-query-repo.js';
import { PostsService } from './posts-service.js';
import { CommentsQueryRepo } from '../comments/comments-query-repo.js';
import { CommentsService } from '../comments/comments-service.js';

@injectable()
export class PostsController {
  constructor(
    @inject(PostsRepo) private postsRepo: PostsRepo,
    @inject(PostsQueryRepo) private postsQueryRepo: PostsQueryRepo,
    @inject(PostsService) private postsService: PostsService,
    @inject(CommentsQueryRepo) private commentsQueryRepo: CommentsQueryRepo,
    @inject(CommentsService) private commentsService: CommentsService,
  ) {}

  async getAllPosts(req: Request, res: Response) {
    const pagingParams = getPagingParams(req);
    const posts = await this.postsQueryRepo.getPosts(pagingParams);
    res.status(HTTP_STATUS.OK_200).json(posts);
  }

  async findPost(req: Request, res: Response) {
    const id = req.params.id;
    const post = await this.postsRepo.findPost(id);
    if (!post) {
      res.status(HTTP_STATUS.NOT_FOUND_404).json({ error: 'Post not found' });
      return;
    }
    res.status(HTTP_STATUS.OK_200).json(post);
  }

  async createPost(req: Request, res: Response) {
    const { title, shortDescription, content, blogId } = req.body;
    const result = await this.postsService.createPost(title, shortDescription, content, blogId);
    // Проверка существования блога в кастомном методе валидатора
    res.status(HTTP_STATUS.CREATED_201).json(result.data);
  }

  async updatePost(req: Request, res: Response) {
    const id = req.params.id;
    const { title, shortDescription, content } = req.body;
    const result = await this.postsService.updatePost(id, title, shortDescription, content);
    if (result.status !== RESULT_STATUS.NO_CONTENT) {
      res.status(httpCodeByResult(result.status)).json(result.extensions);
      return;
    }

    res.status(HTTP_STATUS.NO_CONTENT_204).end();
  }

  async deletePost(req: Request, res: Response) {
    const id = req.params.id;
    const result = await this.postsService.deletePost(id);
    if (result.status !== RESULT_STATUS.NO_CONTENT) {
      res.status(httpCodeByResult(result.status)).json(result.extensions);
      return;
    }

    res.status(HTTP_STATUS.NO_CONTENT_204).end();
  }

  async getCommentsForPost(req: Request, res: Response) {
    const postId = req.params.postId;
    const userId = res.locals.userId ?? null;
    const post = await this.postsRepo.findPost(postId);
    if (!post) {
      res.status(HTTP_STATUS.NOT_FOUND_404).json({ error: 'Post not found' });
      return;
    }
    const pagingParams = getPagingParams(req);
    const comments = await this.commentsQueryRepo.getCommentsForPost(postId, userId, pagingParams);
    res.status(HTTP_STATUS.OK_200).json(comments);
  }

  async createComment(req: Request, res: Response) {
    const postId = req.params.postId;
    const content = req.body.content;
    const userId = res.locals.userId;

    const result = await this.commentsService.createComment(postId, content, userId);
    if (result.status !== RESULT_STATUS.CREATED) {
      res.status(httpCodeByResult(result.status)).json(result.extensions);
      return;
    }

    res.status(HTTP_STATUS.CREATED_201).json(result.data);
  }
}
