import mongoose, { Schema } from 'mongoose';
import { CommentLikesDbType } from './likes-types.js';
import { SETTINGS } from '../../settings.js';

const commentLikesSchema = new Schema<CommentLikesDbType>(
  {
    commentId: { type: String, required: true },
    likes: {
      count: { type: Number, required: true },
      userIds: { type: [String], required: true },
    },
    dislikes: {
      count: { type: Number, required: true },
      userIds: { type: [String], required: true },
    },
  },
  { versionKey: false },
);

export const CommentLikesModel = mongoose.model(SETTINGS.DB_COLLECTIONS.COMMENT_LIKES, commentLikesSchema);
