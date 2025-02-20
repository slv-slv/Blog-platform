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

  async like(commentId: string, userId: string): Promise<void> {
    await this.model.updateOne(
      { commentId },
      { $inc: { 'likes.count': 1, $push: { 'likes.userIds': userId } } },
    );
  }

  async unlike(commentId: string, userId: string): Promise<void> {
    await this.model.updateOne(
      { commentId },
      { $inc: { 'likes.count': -1, $pull: { 'likes.userIds': userId } } },
    );
  }

  async dislike(commentId: string, userId: string): Promise<void> {
    await this.model.updateOne(
      { commentId },
      { $inc: { 'dislikes.count': 1, $push: { 'dislikes.userIds': userId } } },
    );
  }

  async undislike(commentId: string, userId: string): Promise<void> {
    await this.model.updateOne(
      { commentId },
      { $inc: { 'dislikes.count': -1, $pull: { 'dislikes.userIds': userId } } },
    );
  }
}
