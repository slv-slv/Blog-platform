import { inject, injectable } from 'inversify';
import { BlogType } from './blogs-types.js';
import { BlogsRepo } from './blogs-repo.js';

@injectable()
export class BlogsService {
  constructor(@inject(BlogsRepo) private blogsRepo: BlogsRepo) {}

  async createBlog(name: string, description: string, websiteUrl: string): Promise<BlogType> {
    const createdAt = new Date().toISOString();
    const isMembership = false;
    return await this.blogsRepo.createBlog(name, description, websiteUrl, createdAt, isMembership);
  }

  async updateBlog(id: string, name: string, description: string, websiteUrl: string): Promise<boolean> {
    return await this.blogsRepo.updateBlog(id, name, description, websiteUrl);
  }

  async deleteBlog(id: string): Promise<boolean> {
    return await this.blogsRepo.deleteBlog(id);
  }
}
