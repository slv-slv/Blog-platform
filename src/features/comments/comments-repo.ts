import { Collection, ObjectId } from 'mongodb';
import { CurrentUserType } from '../users/users-types.js';
import { CommentType, CommentDbType } from './comments-types.js';
import { inject, injectable } from 'inversify';

@injectable()
export class CommentsRepo {
  constructor(@inject('CommentsCollection') private collection: Collection<CommentDbType>) {}

  async createComment(
    postId: string,
    content: string,
    user: CurrentUserType,
    createdAt: string,
  ): Promise<CommentType> {
    const _id = new ObjectId();
    const commentatorInfo = { userId: user.userId, userLogin: user.login };
    await this.collection.insertOne({
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
    const updateResult = await this.collection.updateOne({ _id }, { $set: { content } });
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
    const deleteResult = await this.collection.deleteOne({ _id });
    return deleteResult.deletedCount > 0;
  }
}
