import { ObjectId } from 'mongodb';
import { db } from '../../db/db.js';
import { SETTINGS } from '../../settings.js';
import { CurrentUserType } from '../users/user-types.js';
import { CommentType, CommentDBType } from './comment-types.js';

export const commentsColl = db.collection<CommentDBType>(SETTINGS.DB_COLLECTIONS.COMMENTS);

export const commentsRepo = {
  createComment: async (
    postId: string,
    content: string,
    user: CurrentUserType,
    createdAt: string,
  ): Promise<CommentType> => {
    const newComment = {
      content,
      postId,
      commentatorInfo: { userId: user.userId, userLogin: user.login },
      createdAt,
    };
    const createResult = await commentsColl.insertOne(newComment);
    const insertedComment = await commentsColl.findOne(
      { _id: createResult.insertedId },
      { projection: { _id: 0, postId: 0 } },
    );
    const id = createResult.insertedId.toString();
    return { id, ...insertedComment } as CommentType;
  },

  updateComment: async (id: string, content: string): Promise<boolean> => {
    const _id = new ObjectId(id);
    const updateResult = await commentsColl.updateOne({ _id }, { $set: { content } });
    if (!updateResult.matchedCount) {
      return false;
    }
    return true;
  },

  deleteComment: async (id: string): Promise<boolean> => {
    if (!ObjectId.isValid(id)) {
      return false;
    }
    const _id = new ObjectId(id);
    const deleteResult = await commentsColl.deleteOne({ _id });
    return deleteResult.deletedCount > 0;
  },

  deleteAllComments: async (): Promise<void> => {
    await commentsColl.deleteMany({});
  },
};
