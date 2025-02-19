import mongoose, { Schema } from 'mongoose';
import { CommentDbType } from './comments-types.js';
import { SETTINGS } from '../../settings.js';

const commentSchema = new Schema<CommentDbType>(
  {
    postId: { type: String, required: true },
    content: { type: String, required: true },
    commentatorInfo: {
      userId: { type: String, required: true },
      userLogin: { type: String, required: true },
    },
    createdAt: { type: String, required: true },
  },
  { versionKey: false },
);

export const CommentModel = mongoose.model(SETTINGS.DB_COLLECTIONS.COMMENTS, commentSchema);
