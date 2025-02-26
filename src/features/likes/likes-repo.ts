import { inject, injectable } from 'inversify';
import { Model } from 'mongoose';
import { CommentLikesDbType, CommentLikesType } from './likes-types.js';

@injectable()
export class CommentLikesRepo {
  constructor(@inject('CommentLikesModel') private model: Model<CommentLikesDbType>) {}
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
