import { SETTINGS } from '../settings.js';
import { db } from '../db/db.js';
import { PostType } from '../types/posts-types.js';
import { blogsRepo } from './blogs-db-access.js';

const postsColl = db.collection<PostType>(SETTINGS.DB_COLLECTIONS.POSTS);

export const postsRepo = {
  getPosts: async (): Promise<PostType[]> => {
    const posts = await postsColl.find({}, { projection: { _id: 0 } }).toArray();
    return posts;
  },

  findPost: async (id: string): Promise<PostType | null> => {
    const foundPost = await postsColl.findOne({ id }, { projection: { _id: 0 } });
    if (!foundPost) {
      return null;
    }
    return foundPost;
  },

  createPost: async (postProps: {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
  }): Promise<PostType> => {
    const id = ((await postsColl.countDocuments()) + 1 || 1).toString();
    const blog = await blogsRepo.findBlog(postProps.blogId);
    const blogName = blog?.name as string;
    const createdAt = new Date().toISOString();
    const isMembership = false;
    const newPost = { id, ...postProps, blogName, createdAt, isMembership };
    const createResult = await postsColl.insertOne(newPost);
    const insertedPost = await postsColl.findOne({ _id: createResult.insertedId }, { projection: { _id: 0 } });
    return insertedPost as PostType;
  },

  updatePost: async (
    id: string,
    postProps: {
      title: string;
      shortDescription: string;
      content: string;
      blogId: string;
    },
  ): Promise<boolean> => {
    const blog = await blogsRepo.findBlog(postProps.blogId);
    const blogName = blog?.name;
    const updateResult = await postsColl.updateOne({ id }, { $set: { ...postProps, blogName } });
    if (!updateResult.matchedCount) {
      return false;
    }
    return true;
  },

  deletePost: async (id: string): Promise<boolean> => {
    const deleteResult = await postsColl.deleteOne({ id });
    if (!deleteResult.deletedCount) {
      return false;
    }
    return true;
  },

  deleteAllPosts: async (): Promise<void> => {
    await postsColl.deleteMany({});
  },
};
