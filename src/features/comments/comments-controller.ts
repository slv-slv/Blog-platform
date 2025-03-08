import { Request, Response } from 'express';
import { HTTP_STATUS } from '../../common/types/http-status-codes.js';
import { httpCodeByResult, RESULT_STATUS } from '../../common/types/result-status-codes.js';
import { inject, injectable } from 'inversify';
import { CommentsQueryRepo } from './comments-query-repo.js';
import { CommentsService } from './comments-service.js';
import { CommentLikesService } from '../likes/comments/comment-likes-service.js';

@injectable()
export class CommentsController {
  constructor(
    @inject(CommentsQueryRepo) private commentsQueryRepo: CommentsQueryRepo,
    @inject(CommentsService) private commentsService: CommentsService,
    @inject(CommentLikesService) private commentLikesService: CommentLikesService,
  ) {}

  async findComment(req: Request, res: Response) {
    const id = req.params.id;
    const userId = res.locals.userId;

    const comment = await this.commentsQueryRepo.findComment(id, userId);
    if (!comment) {
      res.status(HTTP_STATUS.NOT_FOUND_404).json({ error: 'Comment not found' });
      return;
    }
    res.status(HTTP_STATUS.OK_200).json(comment);
  }

  async updateComment(req: Request, res: Response) {
    const commentId = req.params.commentId;
    const content = req.body.content;
    const userId = res.locals.userId;

    const result = await this.commentsService.updateComment(commentId, content, userId);
    if (result.status !== RESULT_STATUS.NO_CONTENT) {
      res.status(httpCodeByResult(result.status)).json(result.extensions);
      return;
    }

    res.status(HTTP_STATUS.NO_CONTENT_204).end();
  }

  async deleteComment(req: Request, res: Response) {
    const commentId = req.params.commentId;
    const userId = res.locals.userId;

    const result = await this.commentsService.deleteComment(commentId, userId);
    if (result.status !== RESULT_STATUS.NO_CONTENT) {
      res.status(httpCodeByResult(result.status)).json(result.extensions);
      return;
    }

    res.status(HTTP_STATUS.NO_CONTENT_204).end();
  }

  async setLikeStatus(req: Request, res: Response) {
    const commentId = req.params.commentId;
    const userId = res.locals.userId;
    const likeStatus = req.body.likeStatus;

    const result = await this.commentLikesService.setLikeStatus(commentId, userId, likeStatus);

    if (result.status !== RESULT_STATUS.NO_CONTENT) {
      res.status(httpCodeByResult(result.status)).json(result.extensions);
    }

    res.status(HTTP_STATUS.NO_CONTENT_204).end();
  }
}
