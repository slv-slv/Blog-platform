import { blogsRepo } from '../repositories/business-logic/blogs-repo.js';
import { blogsViewModelRepo } from '../repositories/view-models/blogs-view-model-repo.js';
import { BlogsPaginatedViewModel, BlogType } from '../types/blog-types.js';
import { PaginationParams } from '../types/pagination-params.js';

export const blogsService = {
  // getAllBlogs: async (paginationParams: PaginationParams): Promise<BlogsPaginatedViewModel> => {
  //   return await blogsViewModelRepo.getAllBlogs(paginationParams);
  // },

  // findBlog: async (id: string): Promise<BlogType | null> => {
  //   return await blogsViewModelRepo.findBlog(id);
  // },

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
