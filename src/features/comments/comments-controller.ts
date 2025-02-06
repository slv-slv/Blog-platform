import { Request, Response } from 'express';
import { HTTP_STATUS } from '../../common/types/http-status-codes.js';
import { httpCodeByResult, RESULT_STATUS } from '../../common/types/result-status-codes.js';
import { commentsQueryRepo } from '../../instances/repositories.js';
import { commentsService } from '../../instances/services.js';

export class CommentsController {
  async findComment(req: Request, res: Response) {
    const id = req.params.id;
    const comment = await commentsQueryRepo.findComment(id);
    if (!comment) {
      res.status(HTTP_STATUS.NOT_FOUND_404).json({ error: 'Comment not found' });
      return;
    }
    res.status(HTTP_STATUS.OK_200).json(comment);
  }

  async updateComment(req: Request, res: Response) {
    const id = req.params.commentId;
    const comment = await commentsQueryRepo.findComment(id);
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

    const isUpdated = await commentsService.updateComment(id, content);
    if (isUpdated.status !== RESULT_STATUS.NO_CONTENT) {
      res.status(httpCodeByResult(isUpdated.status)).json(isUpdated.extensions);
      return;
    }

    res.status(httpCodeByResult(isUpdated.status)).end();
  }

  async deleteComment(req: Request, res: Response) {
    const id = req.params.commentId;
    const comment = await commentsQueryRepo.findComment(id);
    if (!comment) {
      res.status(HTTP_STATUS.NOT_FOUND_404).json({ error: 'Comment not found' });
      return;
    }

    const tokenOwnerId = res.locals.userId;
    if (tokenOwnerId !== comment.commentatorInfo.userId) {
      res.status(HTTP_STATUS.FORBIDDEN_403).json({ error: 'Access denied' });
      return;
    }

    const isDeleted = await commentsService.deleteComment(id);
    if (isDeleted.status !== RESULT_STATUS.NO_CONTENT) {
      res.status(httpCodeByResult(isDeleted.status)).json(isDeleted.extensions);
      return;
    }

    res.status(httpCodeByResult(isDeleted.status)).end();
  }
}
