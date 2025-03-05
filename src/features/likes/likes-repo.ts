import { inject, injectable } from 'inversify';
import { Model } from 'mongoose';
import { CommentLikesDbType, CommentLikesType, LikeStatus } from './likes-types.js';

@injectable()
export class CommentLikesRepo {
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

  async createLikesInfo(likesInfo: CommentLikesType): Promise<void> {
    await this.model.insertOne(likesInfo);
  }

  async deleteLikesInfo(commentId: string): Promise<void> {
    await this.model.deleteOne({ commentId });
  }

  async setLike(commentId: string, userId: string, createdAt: Date): Promise<void> {
    const like = { userId, createdAt };
    await this.model.updateOne(
      { commentId },
      { $push: { likes: like }, $pull: { dislikes: { userId: userId } } },
    );
  }

  async setDislike(commentId: string, userId: string, createdAt: Date): Promise<void> {
    const dislike = { userId, createdAt };
    await this.model.updateOne(
      { commentId },
      { $push: { dislikes: dislike }, $pull: { likes: { userId: userId } } },
    );
  }

  async setNone(commentId: string, userId: string): Promise<void> {
    await this.model.updateOne(
      { commentId },
      { $pull: { likes: { userId: userId }, dislikes: { userId: userId } } },
    );
  }
}
