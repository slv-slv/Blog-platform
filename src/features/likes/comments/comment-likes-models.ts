import mongoose, { Schema } from 'mongoose';
import { CommentLikesDbType } from './comment-likes-types.js';
import { SETTINGS } from '../../../settings.js';

const commentLikesSchema = new Schema<CommentLikesDbType>(
  {
    commentId: { type: String, required: true },
    likes: [
      {
        userId: { type: String, required: true },
        createdAt: { type: Date, required: true },
      },
    ],
    dislikes: [
      {
        userId: { type: String, required: true },
        createdAt: { type: Date, required: true },
      },
    ],
  },
  { versionKey: false },
);

export const CommentLikesModel = mongoose.model(SETTINGS.DB_COLLECTIONS.COMMENT_LIKES, commentLikesSchema);
