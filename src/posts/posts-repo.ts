import { blogsViewModelRepo } from '../blogs/blogs-view-model-repo.js';
import { db } from '../db/db.js';
import { SETTINGS } from '../settings.js';
import { PostType } from './post-types.js';

export const postsColl = db.collection<PostType>(SETTINGS.DB_COLLECTIONS.POSTS);

export const postsRepo = {
  // getPosts: async (): Promise<PostType[]> => {
  //   const posts = await postsColl.find({}, { projection: { _id: 0 } }).toArray();
  //   return posts;
  // },

  // findPost: async (id: string): Promise<PostType | null> => {
  //   const foundPost = await postsColl.findOne({ id }, { projection: { _id: 0 } });
  //   if (!foundPost) {
  //     return null;
  //   }
  //   return foundPost;
  // },

  createPost: async (
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    createdAt: string,
  ): Promise<PostType> => {
    const id = ((await postsColl.countDocuments()) + 1 || 1).toString();
    const blog = await blogsViewModelRepo.findBlog(blogId);
    const blogName = blog!.name as string;
    const newPost = { id, title, shortDescription, content, blogId, blogName, createdAt };
    const createResult = await postsColl.insertOne(newPost);
    const insertedPost = await postsColl.findOne({ _id: createResult.insertedId }, { projection: { _id: 0 } });
    return insertedPost as PostType;
  },

  updatePost: async (id: string, title: string, shortDescription: string, content: string): Promise<boolean> => {
    const updateResult = await postsColl.updateOne({ id }, { $set: { title, shortDescription, content } });
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
