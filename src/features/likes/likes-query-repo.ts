import { inject, injectable } from 'inversify';
import { CommentLikesDbType, LikesInfoViewType, LikeStatus } from './likes-types.js';
import { Model } from 'mongoose';

@injectable()
export class CommentLikesQueryRepo {
  constructor(@inject('CommentLikesModel') private model: Model<CommentLikesDbType>) {}

  async getLikesCount(commentId: string): Promise<number> {
    const result = await this.model.aggregate([
      { $match: { commentId } },
      { $project: { likesCount: { $size: '$likes' } } },
    ]);
    return result[0]?.likesCount ?? 0;
  }

  async getDislikesCount(commentId: string): Promise<number> {
    const result = await this.model.aggregate([
      { $match: { commentId } },
      { $project: { dislikesCount: { $size: '$dislikes' } } },
    ]);
    return result[0]?.dislikesCount ?? 0;
  }

  async getLikeStatus(commentId: string, userId: string): Promise<LikeStatus> {
    if (userId === null) return LikeStatus.None;

    const comment = await this.model
      .findOne({ commentId, $or: [{ 'likes.userId': userId }, { 'dislikes.userId': userId }] })
      .lean();

    if (!comment) return LikeStatus.None;
    if (comment.likes.some((like) => like.userId === userId)) return LikeStatus.Like;
    if (comment.dislikes.some((dislike) => dislike.userId === userId)) return LikeStatus.Dislike;

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
