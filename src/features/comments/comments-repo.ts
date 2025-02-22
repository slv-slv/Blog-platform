import { Collection, ObjectId } from 'mongodb';
import { CurrentUserType } from '../users/users-types.js';
import { CommentDbType, CommentDtoType } from './comments-types.js';
import { inject, injectable } from 'inversify';
import { Model } from 'mongoose';

@injectable()
export class CommentsRepo {
  constructor(@inject('CommentModel') private model: Model<CommentDbType>) {}

  async findComment(id: string): Promise<CommentDtoType | null> {
    if (!ObjectId.isValid(id)) {
      return null;
    }
    const _id = new ObjectId(id);
    const comment = await this.model.findById(_id, { _id: 0 }).lean();
    if (!comment) {
      return null;
    }
    return { id, ...comment };
  }

  async createComment(
    postId: string,
    content: string,
    createdAt: string,
    commentatorInfo: { userId: string; userLogin: string },
  ): Promise<CommentDtoType> {
    const _id = new ObjectId();
    await this.model.insertOne({
      _id,
      postId,
      content,
      commentatorInfo,
      createdAt,
    });
    const id = _id.toString();
    return { id, content, commentatorInfo, createdAt };
  }

  async updateComment(id: string, content: string): Promise<boolean> {
    if (!ObjectId.isValid(id)) {
      return false;
    }
    const _id = new ObjectId(id);
    const updateResult = await this.model.updateOne({ _id }, { $set: { content } });
    if (!updateResult.matchedCount) {
      return false;
    }
    return true;
  }

  async deleteComment(id: string): Promise<boolean> {
    if (!ObjectId.isValid(id)) {
      return false;
    }
    const _id = new ObjectId(id);
    const deleteResult = await this.model.deleteOne({ _id });
    return deleteResult.deletedCount > 0;
  }
}
