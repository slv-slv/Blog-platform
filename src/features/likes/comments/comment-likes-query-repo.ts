import { inject, injectable } from 'inversify';
import { Model } from 'mongoose';
import { CommentLikesDbType } from './comment-likes-types.js';
import { CommentLikesRepo } from './comment-likes-repo.js';
import { LikesInfoViewType } from '../types/likes-types.js';

@injectable()
export class CommentLikesQueryRepo {
  constructor(
    @inject('CommentLikesModel') private model: Model<CommentLikesDbType>,
    @inject(CommentLikesRepo) private commentLikesRepo: CommentLikesRepo,
  ) {}

  async getLikesInfo(commentId: string, userId: string | null): Promise<LikesInfoViewType> {
    const likesCount = await this.commentLikesRepo.getLikesCount(commentId);
    const dislikesCount = await this.commentLikesRepo.getDislikesCount(commentId);
    const myStatus = await this.commentLikesRepo.getLikeStatus(commentId, userId);

    return { likesCount, dislikesCount, myStatus };
  }

  // async getLikesInfoArray(commentIds: string[], userId: string): Promise<Array<string & LikesInfoViewType>> {
  //   const arr = this.model.find({ commentId: { $elemMatch: commentIds } });
  // }
}
