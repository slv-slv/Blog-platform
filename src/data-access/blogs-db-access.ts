import { SETTINGS } from '../settings.js';
import { db } from '../db/db.js';
import { BlogType } from '../types/blog-types.js';
import { ObjectId } from 'mongodb';

const blogsColl = db.collection(SETTINGS.DB_COLLECTIONS.BLOGS);

export const blogsRepo = {
  getBlogs: async (): Promise<BlogType[]> => {
    const blogs = await blogsColl.find({}).toArray();
    return blogs as BlogType[];
  },

  findBlog: async (id: string): Promise<BlogType | null> => {
    const _id = new ObjectId(id);
    const foundBlog = await blogsColl.findOne({ _id });
    if (!foundBlog) {
      return null;
    }
    return foundBlog as BlogType;
  },

  createBlog: async (blogProps: { name: string; description: string; websiteUrl: string }): Promise<BlogType> => {
    const createdAt = new Date().toISOString();
    const isMembership = false;
    const newBlog = { ...blogProps, createdAt, isMembership };
    const result = await blogsColl.insertOne(newBlog);
    const insertedBlog = await blogsColl.findOne({ _id: result.insertedId });
    return insertedBlog as BlogType;
  },

  updateBlog: async (
    id: string,
    blogProps: { name: string; description: string; websiteUrl: string },
  ): Promise<boolean> => {
    const _id = new ObjectId(id);
    const result = await blogsColl.updateOne({ _id }, { $set: { ...blogProps } });
    if (!result.matchedCount) {
      return false;
    }
    return true;
  },

  deleteBlog: async (id: string): Promise<boolean> => {
    const _id = new ObjectId(id);
    const result = await blogsColl.deleteOne({ _id });
    if (!result.deletedCount) {
      return false;
    }
    return true;
  },

  deleteAllBlogs: async (): Promise<void> => {
    await blogsColl.deleteMany({});
  },
};
