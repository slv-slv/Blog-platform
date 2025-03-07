import { inject, injectable } from 'inversify';
import { CommentLikesRepo } from './likes-repo.js';
import { CommentLikesQueryRepo } from './likes-query-repo.js';
import { CommentLikesType, LikeStatus } from './likes-types.js';
import { CommentsRepo } from '../comments/comments-repo.js';
import { Result } from '../../common/types/result-object.js';
import { RESULT_STATUS } from '../../common/types/result-status-codes.js';

@injectable()
export class CommentLikesService {
  constructor(
    @inject(CommentsRepo) private commentsRepo: CommentsRepo,
    @inject(CommentLikesRepo) private commentLikesRepo: CommentLikesRepo,
  ) {}

  async setLikeStatus(commentId: string, userId: string, likeStatus: LikeStatus): Promise<Result<null>> {
    const comment = await this.commentsRepo.findComment(commentId);
    if (!comment) {
      return {
        status: RESULT_STATUS.NOT_FOUND,
        errorMessage: 'Comment not found',
        extensions: [{ message: 'Comment not found', field: 'commentId' }],
        data: null,
      };
    }

    const currentLikeStatus = await this.commentLikesRepo.getLikeStatus(commentId, userId);
    if (likeStatus === currentLikeStatus) {
      return {
        status: RESULT_STATUS.NO_CONTENT,
        data: null,
      };
    }

    const createdAt = new Date();

    switch (likeStatus) {
      case LikeStatus.None:
        await this.commentLikesRepo.setNone(commentId, userId);
        break;
      case LikeStatus.Like:
        await this.commentLikesRepo.setLike(commentId, userId, createdAt);
        break;
      case LikeStatus.Dislike:
        await this.commentLikesRepo.setDislike(commentId, userId, createdAt);
        break;
    }

    return {
      status: RESULT_STATUS.NO_CONTENT,
      data: null,
    };
  }

  async createLikesInfo(commentId: string): Promise<void> {
    const likesInfo: CommentLikesType = {
      commentId,
      likes: [],
      dislikes: [],
    };

    await this.commentLikesRepo.createLikesInfo(likesInfo);
  }

  async deleteLikesInfo(commentId: string): Promise<void> {
    await this.commentLikesRepo.deleteLikesInfo(commentId);
  }
}
