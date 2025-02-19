import mongoose, { Schema } from 'mongoose';
import { SETTINGS } from '../../settings.js';
import { PostDbType } from './posts-types.js';

const postSchema = new Schema<PostDbType>(
  {
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    content: { type: String, required: true },
    blogId: { type: String, required: true },
    blogName: { type: String, required: true },
    createdAt: { type: String, required: true },
  },
  { versionKey: false },
);

// const postPaginatedSchema = new Schema({
//   pagesCount: { type: Number, required: true },
//   page: { type: Number, required: true },
//   pageSize: { type: Number, required: true },
//   totalCount: { type: Number, required: true },
//   items: [postSchema],
// });

export const PostModel = mongoose.model(SETTINGS.DB_COLLECTIONS.POSTS, postSchema);
