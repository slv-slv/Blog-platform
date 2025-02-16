import { Request, Response } from 'express';
import { getPagingParams } from '../../common/utils/get-paging-params.js';
import { HTTP_STATUS } from '../../common/types/http-status-codes.js';
import { httpCodeByResult } from '../../common/types/result-status-codes.js';
import { inject, injectable } from 'inversify';
import { PostsQueryRepo } from './posts-query-repo.js';
import { PostsService } from './posts-service.js';
import { CommentsQueryRepo } from '../comments/comments-query-repo.js';
import { CommentsService } from '../comments/comments-service.js';
import { UsersQueryRepo } from '../users/users-query-repo.js';

@injectable()
export class PostsController {
  constructor(
    @inject(PostsQueryRepo) private postsQueryRepo: PostsQueryRepo,
    @inject(PostsService) private postsService: PostsService,
    @inject(CommentsQueryRepo) private commentsQueryRepo: CommentsQueryRepo,
    @inject(CommentsService) private commentsService: CommentsService,
    @inject(UsersQueryRepo) private usersQueryRepo: UsersQueryRepo,
  ) {}

  async getAllPosts(req: Request, res: Response) {
    const pagingParams = getPagingParams(req);
    const posts = await this.postsQueryRepo.getPosts(pagingParams);
    res.status(HTTP_STATUS.OK_200).json(posts);
  }

  async findPost(req: Request, res: Response) {
    const id = req.params.id;
    const post = await this.postsQueryRepo.findPost(id);
    if (!post) {
      res.status(HTTP_STATUS.NOT_FOUND_404).json({ error: 'Post not found' });
      return;
    }
    res.status(HTTP_STATUS.OK_200).json(post);
  }

  async createPost(req: Request, res: Response) {
    const { title, shortDescription, content, blogId } = req.body;
    const newPost = await this.postsService.createPost(title, shortDescription, content, blogId);
    res.status(HTTP_STATUS.CREATED_201).json(newPost);
  }

  async updatePost(req: Request, res: Response) {
    const id = req.params.id;
    const { title, shortDescription, content } = req.body;
    const isUpdated = await this.postsService.updatePost(id, title, shortDescription, content);
    if (!isUpdated) {
      res.status(HTTP_STATUS.NOT_FOUND_404).json({ error: 'Post not found' });
      return;
    }

    res.status(HTTP_STATUS.NO_CONTENT_204).end();
  }

  async deletePost(req: Request, res: Response) {
    const id = req.params.id;
    const isDeleted = await this.postsService.deletePost(id);
    if (!isDeleted) {
      res.status(HTTP_STATUS.NOT_FOUND_404).json({ error: 'Post not found' });
      return;
    }
    res.status(HTTP_STATUS.NO_CONTENT_204).end();
  }

  async getCommentsForPost(req: Request, res: Response) {
    const postId = req.params.postId;
    const post = await this.postsQueryRepo.findPost(postId);
    if (!post) {
      res.status(HTTP_STATUS.NOT_FOUND_404).json({ error: 'Post not found' });
      return;
    }
    const pagingParams = getPagingParams(req);
    const comments = await this.commentsQueryRepo.getCommentsForPost(postId, pagingParams);
    res.status(HTTP_STATUS.OK_200).json(comments);
  }

  async createComment(req: Request, res: Response) {
    const postId = req.params.postId;
    const post = await this.postsQueryRepo.findPost(postId);
    if (!post) {
      res.status(HTTP_STATUS.NOT_FOUND_404).json({ error: 'Post not found' });
      return;
    }

    const content = req.body.content;

    // Как-то по другому извлекать userId из access-токена?
    const userId = res.locals.userId;
    const user = await this.usersQueryRepo.getCurrentUser(userId);
    if (!user) {
      res.status(HTTP_STATUS.UNAUTHORIZED_401).json({ error: 'User not found' });
      return;
    }
    const result = await this.commentsService.createComment(postId, content, user);
    res.status(httpCodeByResult(result.status)).json(result.data);
  }
}
