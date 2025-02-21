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

  async setLike(commentId: string, userId: string): Promise<void> {
    await this.model.updateOne(
      { commentId },
      { $push: { usersLiked: userId }, $pull: { usersDisliked: userId } },
    );
  }

  async setDislike(commentId: string, userId: string): Promise<void> {
    await this.model.updateOne(
      { commentId },
      { $push: { usersDisliked: userId }, $pull: { usersLiked: userId } },
    );
  }

  async setNone(commentId: string, userId: string): Promise<void> {
    await this.model.updateOne({ commentId }, { $pull: { usersLiked: userId, usersDisliked: userId } });
  }
}
