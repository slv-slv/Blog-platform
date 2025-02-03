import { postsRepo } from '../../infrastructure/db/repositories.js';
import { PostType } from './posts-types.js';

class PostsService {
  async createPost(
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
  ): Promise<PostType> {
    const createdAt = new Date().toISOString();
    return await postsRepo.createPost(title, shortDescription, content, blogId, createdAt);
  }

  async updatePost(id: string, title: string, shortDescription: string, content: string): Promise<boolean> {
    return await postsRepo.updatePost(id, title, shortDescription, content);
  }

  async deletePost(id: string): Promise<boolean> {
    return await postsRepo.deletePost(id);
  }
}

export const postsService = new PostsService();
