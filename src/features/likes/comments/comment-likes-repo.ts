import { inject, injectable } from 'inversify';
import { Model } from 'mongoose';
import { CommentLikesDbType, CommentLikesType } from './comment-likes-types.js';
import { LikeStatus } from '../types/likes-types.js';

@injectable()
export class CommentLikesRepo {
  constructor(@inject('CommentLikesModel') private model: Model<CommentLikesDbType>) {}

  async getLikesCount(commentId: string): Promise<number> {
    const comment = await this.model.findOne({ commentId }).lean();
    if (!comment) return 0;

    const result = await this.model.aggregate([
      { $match: { commentId } },
      { $project: { likesCount: { $size: '$likes' } } },
    ]);
    return result[0].likesCount;
  }

  async getDislikesCount(commentId: string): Promise<number> {
    const comment = await this.model.findOne({ commentId }).lean();
    if (!comment) return 0;

    const result = await this.model.aggregate([
      { $match: { commentId } },
      { $project: { dislikesCount: { $size: '$dislikes' } } },
    ]);
    return result[0].dislikesCount;
  }

  async getLikeStatus(commentId: string, userId: string | null): Promise<LikeStatus> {
    if (userId === null) return LikeStatus.None;

    const comment = await this.model
      .findOne(
        { commentId },
        {
          likes: { $elemMatch: { userId } },
          dislikes: { $elemMatch: { userId } },
        },
      )
      .lean();

    if (!comment) return LikeStatus.None;

    if (comment.likes) return LikeStatus.Like;
    if (comment.dislikes) return LikeStatus.Dislike;

    return LikeStatus.None;
  }

  // async createLikesInfo(likesInfo: CommentLikesType): Promise<void> {
  //   await this.model.insertOne(likesInfo);
  // }

  async deleteLikesInfo(commentId: string): Promise<void> {
    await this.model.deleteOne({ commentId });
  }

  async setLike(commentId: string, userId: string, createdAt: Date): Promise<void> {
    const like = { userId, createdAt };

    await this.model.updateOne(
      { commentId },
      { $setOnInsert: { commentId, likes: [], dislikes: [] } },
      { upsert: true },
    );

    await this.model.updateOne(
      { commentId },
      {
        $push: { likes: like },
        $pull: { dislikes: { userId: userId } },
      },
    );
  }

  async setDislike(commentId: string, userId: string, createdAt: Date): Promise<void> {
    const dislike = { userId, createdAt };

    await this.model.updateOne(
      { commentId },
      { $setOnInsert: { commentId, likes: [], dislikes: [] } },
      { upsert: true },
    );

    await this.model.updateOne(
      { commentId },
      {
        $push: { dislikes: dislike },
        $pull: { likes: { userId: userId } },
      },
    );
  }

  async setNone(commentId: string, userId: string): Promise<void> {
    await this.model.updateOne(
      { commentId },
      {
        $pull: { likes: { userId: userId }, dislikes: { userId: userId } },
      },
      { upsert: true },
    );
  }
}
