import { inject, injectable } from 'inversify';
import { CommentLikesDbType, LikesInfoViewType, LikeStatus } from './comment-likes-types.js';
import { Model } from 'mongoose';
import { CommentLikesRepo } from './comment-likes-repo.js';

@injectable()
export class CommentLikesQueryRepo {
  constructor(
    @inject('CommentLikesModel') private model: Model<CommentLikesDbType>,
    @inject(CommentLikesRepo) private commentLikesRepo: CommentLikesRepo,
  ) {}

  async getLikesInfo(commentId: string, userId: string): Promise<LikesInfoViewType> {
    const likesCount = await this.commentLikesRepo.getLikesCount(commentId);
    const dislikesCount = await this.commentLikesRepo.getDislikesCount(commentId);
    const myStatus = await this.commentLikesRepo.getLikeStatus(commentId, userId);

    return { likesCount, dislikesCount, myStatus };
  }

  // async getLikesInfoArray(commentIds: string[], userId: string): Promise<Array<string & LikesInfoViewType>> {
  //   const arr = this.model.find({ commentId: { $elemMatch: commentIds } });
  // }
}
