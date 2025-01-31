import { postsRepo } from './posts-repo.js';
import { PostType } from './posts-types.js';

export const postsService = {
  createPost: async (
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
  ): Promise<PostType> => {
    const createdAt = new Date().toISOString();
    return await postsRepo.createPost(title, shortDescription, content, blogId, createdAt);
  },

  updatePost: async (
    id: string,
    title: string,
    shortDescription: string,
    content: string,
  ): Promise<boolean> => {
    return await postsRepo.updatePost(id, title, shortDescription, content);
  },

  deletePost: async (id: string): Promise<boolean> => {
    return await postsRepo.deletePost(id);
  },
};
