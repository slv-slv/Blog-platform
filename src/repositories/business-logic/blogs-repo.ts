import { SETTINGS } from '../../settings.js';
import { db } from '../../db/db.js';
import { BlogType } from '../../types/blog-types.js';

const blogsColl = db.collection<BlogType>(SETTINGS.DB_COLLECTIONS.BLOGS);

export const blogsRepo = {
  // getBlogs: async (): Promise<BlogType[]> => {
  //   const blogs = await blogsColl.find({}, { projection: { _id: 0 } }).toArray();
  //   return blogs;
  // },

  // findBlog: async (id: string): Promise<BlogType | null> => {
  //   const foundBlog = await blogsColl.findOne({ id }, { projection: { _id: 0 } });
  //   if (!foundBlog) {
  //     return null;
  //   }
  //   return foundBlog;
  // },

  createBlog: async (
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean,
  ): Promise<BlogType> => {
    const id = ((await blogsColl.countDocuments()) + 1 || 1).toString();
    const newBlog = { id, name, description, websiteUrl, createdAt, isMembership };
    const createResult = await blogsColl.insertOne(newBlog);
    const insertedBlog = await blogsColl.findOne({ _id: createResult.insertedId }, { projection: { _id: 0 } });
    return insertedBlog as BlogType;
  },

  updateBlog: async (id: string, name: string, description: string, websiteUrl: string): Promise<boolean> => {
    const updateResult = await blogsColl.updateOne({ id }, { $set: { name, description, websiteUrl } });
    if (!updateResult.matchedCount) {
      return false;
    }
    return true;
  },

  deleteBlog: async (id: string): Promise<boolean> => {
    const deleteResult = await blogsColl.deleteOne({ id });
    if (!deleteResult.deletedCount) {
      return false;
    }
    return true;
  },

  deleteAllBlogs: async (): Promise<void> => {
    await blogsColl.deleteMany({});
  },
};
