import { inject, injectable } from 'inversify';
import { CommentLikesRepo } from './likes-repo.js';
import { CommentLikesQueryRepo } from './likes-query-repo.js';
import { CommentLikesType, LikeStatus } from './likes-types.js';

@injectable()
export class LikesService {
  constructor(
    @inject(CommentLikesRepo) private commentLikesRepo: CommentLikesRepo,
    @inject(CommentLikesQueryRepo) private commentLikesQueryRepo: CommentLikesQueryRepo,
  ) {}

  async setLikeStatus(commentId: string, userId: string, likeStatus: LikeStatus): Promise<void> {
    const currentLikeStatus = await this.commentLikesQueryRepo.getLikeStatus(commentId, userId);

    switch (likeStatus) {
      case LikeStatus.None:
        if (currentLikeStatus === LikeStatus.Like) await this.commentLikesRepo.unlike(commentId, userId);
        if (currentLikeStatus === LikeStatus.Dislike)
          await this.commentLikesRepo.undislike(commentId, userId);
        break;
      case LikeStatus.Like:
        if (currentLikeStatus === LikeStatus.None) await this.commentLikesRepo.like(commentId, userId);
        if (currentLikeStatus === LikeStatus.Dislike) {
          await this.commentLikesRepo.undislike(commentId, userId);
          await this.commentLikesRepo.like(commentId, userId);
        }
        break;
      case LikeStatus.Dislike:
        if (currentLikeStatus === LikeStatus.None) await this.commentLikesRepo.dislike(commentId, userId);
        if (currentLikeStatus === LikeStatus.Like) {
          await this.commentLikesRepo.unlike(commentId, userId);
          await this.commentLikesRepo.dislike(commentId, userId);
        }
        break;
    }
  }

  async createLikesInfo(commentId: string): Promise<void> {
    const likesInfo: CommentLikesType = {
      commentId,
      likes: {
        count: 0,
        userIds: [],
      },
      dislikes: {
        count: 0,
        userIds: [],
      },
    };

    await this.commentLikesRepo.createLikesInfo(likesInfo);
  }

  async deleteLikesInfo(commentId: string): Promise<void> {
    await this.commentLikesRepo.deleteLikesInfo(commentId);
  }
}
