import { blogsRepo } from './blogs-repo.js';
import { BlogType } from './blogs-types.js';

class BlogsService {
  async createBlog(name: string, description: string, websiteUrl: string): Promise<BlogType> {
    const createdAt = new Date().toISOString();
    const isMembership = false;
    return await blogsRepo.createBlog(name, description, websiteUrl, createdAt, isMembership);
  }

  async updateBlog(id: string, name: string, description: string, websiteUrl: string): Promise<boolean> {
    return await blogsRepo.updateBlog(id, name, description, websiteUrl);
  }

  async deleteBlog(id: string): Promise<boolean> {
    return await blogsRepo.deleteBlog(id);
  }
}

export const blogsService = new BlogsService();
