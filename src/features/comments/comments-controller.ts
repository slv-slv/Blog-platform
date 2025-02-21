import { Request, Response } from 'express';
import { HTTP_STATUS } from '../../common/types/http-status-codes.js';
import { httpCodeByResult, RESULT_STATUS } from '../../common/types/result-status-codes.js';
import { inject, injectable } from 'inversify';
import { CommentsQueryRepo } from './comments-query-repo.js';
import { CommentsService } from './comments-service.js';
import { LikesService } from '../likes/likes-service.js';

@injectable()
export class CommentsController {
  constructor(
    @inject(CommentsQueryRepo) private commentsQueryRepo: CommentsQueryRepo,
    @inject(CommentsService) private commentsService: CommentsService,
    @inject(LikesService) private likesService: LikesService,
  ) {}

  async findComment(req: Request, res: Response) {
    const id = req.params.id;
    const comment = await this.commentsQueryRepo.findComment(id);
    if (!comment) {
      res.status(HTTP_STATUS.NOT_FOUND_404).json({ error: 'Comment not found' });
      return;
    }
    res.status(HTTP_STATUS.OK_200).json(comment);
  }

  async updateComment(req: Request, res: Response) {
    const id = req.params.commentId;
    const comment = await this.commentsQueryRepo.findComment(id);
    if (!comment) {
      res.status(HTTP_STATUS.NOT_FOUND_404).json({ error: 'Comment not found' });
      return;
    }

    const jwtPayload = res.locals.jwtPayload;
    const tokenOwnerId = jwtPayload.userId;
    if (tokenOwnerId !== comment.commentatorInfo.userId) {
      res.status(HTTP_STATUS.FORBIDDEN_403).json({ error: 'Access denied' });
      return;
    }

    const content = req.body.content;

    const isUpdated = await this.commentsService.updateComment(id, content);
    if (isUpdated.status !== RESULT_STATUS.NO_CONTENT) {
      res.status(httpCodeByResult(isUpdated.status)).json(isUpdated.extensions);
      return;
    }

    res.status(httpCodeByResult(isUpdated.status)).end();
  }

  async deleteComment(req: Request, res: Response) {
    const id = req.params.commentId;
    const comment = await this.commentsQueryRepo.findComment(id);
    if (!comment) {
      res.status(HTTP_STATUS.NOT_FOUND_404).json({ error: 'Comment not found' });
      return;
    }

    const tokenOwnerId = res.locals.userId;
    if (tokenOwnerId !== comment.commentatorInfo.userId) {
      res.status(HTTP_STATUS.FORBIDDEN_403).json({ error: 'Access denied' });
      return;
    }

    await this.commentsService.deleteComment(id);
    res.status(HTTP_STATUS.NO_CONTENT_204).end();
  }

  async setLikeStatus(req: Request, res: Response) {
    const commentId = req.params.commentId;
    const likeStatus = req.body.likeStatus;

    const userId = res.locals.userId ?? null;

    const result = await this.likesService.setLikeStatus(commentId, userId, likeStatus);

    if (result.status !== RESULT_STATUS.NO_CONTENT) {
      res.status(httpCodeByResult(result.status)).json(result.extensions);
    }

    res.status(HTTP_STATUS.NO_CONTENT_204).end();
  }
}
