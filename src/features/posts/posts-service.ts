import { inject, injectable } from 'inversify';
import { PostType } from './posts-types.js';
import { PostsRepo } from './posts-repo.js';

@injectable()
export class PostsService {
  constructor(@inject(PostsRepo) private postsRepo: PostsRepo) {}

  async createPost(
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
  ): Promise<PostType> {
    const createdAt = new Date().toISOString();
    return await this.postsRepo.createPost(title, shortDescription, content, blogId, createdAt);
  }

  async updatePost(id: string, title: string, shortDescription: string, content: string): Promise<boolean> {
    return await this.postsRepo.updatePost(id, title, shortDescription, content);
  }

  async deletePost(id: string): Promise<boolean> {
    return await this.postsRepo.deletePost(id);
  }
}
