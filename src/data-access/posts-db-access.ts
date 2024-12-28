import { SETTINGS } from '../settings.js';
import { db } from '../db/db.js';
import { PostType } from '../types/posts-types.js';
import { ObjectId } from 'mongodb';
import { blogsRepo } from './blogs-db-access.js';

const postsColl = db.collection(SETTINGS.DB_COLLECTIONS.POSTS);

export const postsRepo = {
  getPosts: async (): Promise<PostType[]> => {
    const posts = await postsColl.find({}).toArray();
    return posts as PostType[];
  },

  findPost: async (id: string): Promise<PostType | null> => {
    const _id = new ObjectId(id);
    const foundPost = await postsColl.findOne({ _id });
    if (!foundPost) {
      return null;
    }
    return foundPost as PostType;
  },

  createPost: async (postProps: {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
  }): Promise<PostType | null> => {
    const blog = await blogsRepo.findBlog(postProps.blogId);
    if (!blog) {
      return null;
    }
    const blogName = blog.name;
    const createdAt = new Date().toISOString();
    const isMembership = false;
    const newPost = { ...postProps, blogName, createdAt, isMembership };
    const result = await postsColl.insertOne(newPost);
    const insertedPost = await postsColl.findOne({ _id: result.insertedId });
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
    const post = await postsRepo.findPost(id);
    if (!post) {
      return false;
    }
    const _id = new ObjectId(id);
    const blog = await blogsRepo.findBlog(postProps.blogId);
    const blogName = blog?.name;
    await postsColl.updateOne({ _id }, { $set: { ...postProps, blogName } });
    return true;
  },

  deletePost: async (id: string): Promise<boolean> => {
    const _id = new ObjectId(id);
    const result = await postsColl.deleteOne({ _id });
    if (!result.deletedCount) {
      return false;
    }
    return true;
  },

  deleteAllPosts: async (): Promise<void> => {
    await postsColl.deleteMany({});
  },
};
