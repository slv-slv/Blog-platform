import { blogsRepo } from './blogs-repo.js';
import { blogsViewModelRepo } from './blogs-view-model-repo.js';
import { BlogsPaginatedViewModel, BlogType } from './blog-types.js';
import { PagingParams } from '../types/paging-params.js';

export const blogsService = {
  createBlog: async (name: string, description: string, websiteUrl: string): Promise<BlogType> => {
    const createdAt = new Date().toISOString();
    const isMembership = false;
    return await blogsRepo.createBlog(name, description, websiteUrl, createdAt, isMembership);
  },

  updateBlog: async (id: string, name: string, description: string, websiteUrl: string): Promise<boolean> => {
    return await blogsRepo.updateBlog(id, name, description, websiteUrl);
  },

  deleteBlog: async (id: string): Promise<boolean> => {
    return await blogsRepo.deleteBlog(id);
  },
};
