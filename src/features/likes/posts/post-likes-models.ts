import mongoose, { Schema } from 'mongoose';
import { SETTINGS } from '../../../settings.js';
import { PostLikesDbType } from './post-likes-types.js';

const postLikesSchema = new Schema<PostLikesDbType>(
  {
    postId: { type: String, required: true },
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

export const PostLikesModel = mongoose.model(SETTINGS.DB_COLLECTIONS.POST_LIKES, postLikesSchema);
