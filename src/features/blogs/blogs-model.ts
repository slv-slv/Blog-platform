import mongoose, { Schema } from 'mongoose';
import { BlogDbType } from './blogs-types.js';
import { SETTINGS } from '../../settings.js';

const blogSchema = new Schema<BlogDbType>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  websiteUrl: { type: String, required: true },
  createdAt: { type: String, required: true },
  isMembership: { type: Boolean, required: true },
});

export const BlogModel = mongoose.model(SETTINGS.DB_COLLECTIONS.BLOGS, blogSchema);
