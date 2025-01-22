import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { formatErrors } from '../../common/utils/format-errors.js';
import { getPagingParams } from '../../common/utils/get-paging-params.js';
import { HTTP_STATUS } from '../../common/types/http-status-codes.js';
import { commentsViewModelRepo } from './comments-view-model-repo.js';
import { commentsService } from './comments-service.js';
import { usersViewModelRepo } from '../users/users-view-model-repo.js';
import { postsViewModelRepo } from '../posts/posts-view-model-repo.js';
import { httpCodeByResult, RESULT_STATUS } from '../../common/types/result-status-codes.js';

export const commentsController = {
  findComment: async (req: Request, res: Response) => {
    const id = req.params.id;
    const comment = await commentsViewModelRepo.findComment(id);
    if (!comment) {
      res.status(HTTP_STATUS.NOT_FOUND_404).json({ error: 'Comment not found' });
      return;
    }
    res.status(HTTP_STATUS.OK_200).json(comment);
  },

  updateComment: async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(HTTP_STATUS.BAD_REQUEST_400).json({ errorsMessages: formatErrors(errors) });
      return;
    }

    const id = req.params.commentId;
    const comment = await commentsViewModelRepo.findComment(id);
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
  },

  deleteComment: async (req: Request, res: Response) => {
    const id = req.params.commentId;
    const comment = await commentsViewModelRepo.findComment(id);
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

    const isDeleted = await commentsService.deleteComment(id);
    if (isDeleted.status !== RESULT_STATUS.NO_CONTENT) {
      res.status(httpCodeByResult(isDeleted.status)).json(isDeleted.extensions);
      return;
    }

    res.status(httpCodeByResult(isDeleted.status)).end();
  },
};
