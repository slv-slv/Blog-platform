import { inject, injectable } from 'inversify';
import { CommentLikesDbType, LikesInfoViewType, LikeStatus } from './likes-types.js';
import { Model } from 'mongoose';

@injectable()
export class CommentLikesQueryRepo {
  constructor(@inject('CommentLikesModel') private model: Model<CommentLikesDbType>) {}

  async getLikesCount(commentId: string): Promise<number> {
    const comment = await this.model.findOne({ commentId }, { likes: 1 }).lean();
    return comment!.likes.count;
  }

  async getDislikesCount(commentId: string): Promise<number> {
    const comment = await this.model.findOne({ commentId }, { dislikes: 1 }).lean();
    return comment!.dislikes.count;
  }

  async getLikeStatus(commentId: string, userId: string): Promise<LikeStatus> {
    const isLiked = await this.model
      .findOne({ commentId, 'likes.userIds': { $elemMatch: { $eq: userId } } })
      .lean();
    if (isLiked) {
      return LikeStatus.Like;
    }

    const isDisliked = await this.model
      .findOne({ commentId, 'dislikes.userIds': { $elemMatch: { $eq: userId } } })
      .lean();
    if (isDisliked) {
      return LikeStatus.Dislike;
    }

    return LikeStatus.None;
  }

  async getLikesInfo(commentId: string, userId: string): Promise<LikesInfoViewType> {
    const likesCount = await this.getLikesCount(commentId);
    const dislikesCount = await this.getDislikesCount(commentId);
    const myStatus = await this.getLikeStatus(commentId, userId);

    return { likesCount, dislikesCount, myStatus };
  }
}
