import mongoose, { Schema } from 'mongoose';
import { CommentLikesDbType } from './likes-types.js';
import { SETTINGS } from '../../settings.js';

const commentLikesSchema = new Schema<CommentLikesDbType>(
  {
    commentId: { type: String, required: true },
    usersLiked: { type: [String], required: true, default: [] },
    usersDisliked: { type: [String], required: true, default: [] },
  },
  { versionKey: false },
);

export const CommentLikesModel = mongoose.model(SETTINGS.DB_COLLECTIONS.COMMENT_LIKES, commentLikesSchema);
