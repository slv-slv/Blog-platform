import { ObjectId } from 'mongodb';
import { CurrentUserType } from '../users/users-types.js';
import { CommentType, CommentDbType } from './comments-types.js';
import { Repository } from '../../infrastructure/db/repository.js';

export class CommentsRepo extends Repository<CommentDbType> {
  async createComment(
    postId: string,
    content: string,
    user: CurrentUserType,
    createdAt: string,
  ): Promise<CommentType> {
    const _id = new ObjectId();
    const newComment = {
      _id,
      postId,
      content,
      commentatorInfo: { userId: user.userId, userLogin: user.login },
      createdAt,
    };
    const createResult = await this.collection.insertOne(newComment);
    const insertedComment = await this.collection.findOne(
      { _id: createResult.insertedId },
      { projection: { _id: 0, postId: 0 } },
    );
    const id = createResult.insertedId.toString();
    return { id, ...insertedComment } as CommentType;
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
