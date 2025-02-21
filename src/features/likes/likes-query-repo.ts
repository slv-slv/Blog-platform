import { inject, injectable } from 'inversify';
import { CommentLikesDbType, LikesInfoViewType, LikeStatus } from './likes-types.js';
import { Model } from 'mongoose';

@injectable()
export class CommentLikesQueryRepo {
  constructor(@inject('CommentLikesModel') private model: Model<CommentLikesDbType>) {}

  async getLikesCount(commentId: string): Promise<number> {
    const result = await this.model.aggregate([
      { $match: { commentId } },
      { $project: { likesCount: { $size: '$usersLiked' } } },
    ]);
    return result[0]?.likesCount ?? 0;
  }

  async getDislikesCount(commentId: string): Promise<number> {
    const result = await this.model.aggregate([
      { $match: { commentId } },
      { $project: { dislikesCount: { $size: '$usersDisliked' } } },
    ]);
    return result[0]?.dislikesCount ?? 0;
  }

  async getLikeStatus(commentId: string, userId: string): Promise<LikeStatus> {
    if (!userId) return LikeStatus.None;

    const likedComment = await this.model
      .findOne({ commentId, usersLiked: { $elemMatch: { $eq: userId } } })
      .lean();
    if (likedComment) {
      return LikeStatus.Like;
    }

    const dislikedComment = await this.model
      .findOne({ commentId, usersDisliked: { $elemMatch: { $eq: userId } } })
      .lean();
    if (dislikedComment) {
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

  // async getLikesInfoArray(commentIds: string[], userId: string): Promise<Array<string & LikesInfoViewType>> {
  //   const arr = this.model.find({ commentId: { $elemMatch: commentIds } });
  // }
}
