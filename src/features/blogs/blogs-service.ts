import { inject, injectable } from 'inversify';
import { BlogType } from './blogs-types.js';
import { BlogsRepo } from './blogs-repo.js';
import { Result } from '../../common/types/result-object.js';
import { RESULT_STATUS } from '../../common/types/result-status-codes.js';

@injectable()
export class BlogsService {
  constructor(@inject(BlogsRepo) private blogsRepo: BlogsRepo) {}

  async createBlog(name: string, description: string, websiteUrl: string): Promise<BlogType> {
    const createdAt = new Date().toISOString();
    const isMembership = false;
    return await this.blogsRepo.createBlog(name, description, websiteUrl, createdAt, isMembership);
  }

  async updateBlog(id: string, name: string, description: string, websiteUrl: string): Promise<Result<null>> {
    const updateResult = await this.blogsRepo.updateBlog(id, name, description, websiteUrl);
    if (!updateResult) {
      return {
        status: RESULT_STATUS.NOT_FOUND,
        errorMessage: 'Not found',
        extensions: [{ message: 'Blog not found', field: 'id' }],
        data: null,
      };
    }

    return {
      status: RESULT_STATUS.NO_CONTENT,
      data: null,
    };
  }

  async deleteBlog(id: string): Promise<Result<null>> {
    const deleteResult = await this.blogsRepo.deleteBlog(id);
    if (!deleteResult) {
      return {
        status: RESULT_STATUS.NOT_FOUND,
        errorMessage: 'Not found',
        extensions: [{ message: 'Blog not found', field: 'id' }],
        data: null,
      };
    }

    return {
      status: RESULT_STATUS.NO_CONTENT,
      data: null,
    };
  }
}
