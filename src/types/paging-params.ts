import { BlogType } from '../features/blogs/blog-types.js';

export type PagingParams = {
  sortBy: keyof BlogType;
  sortDirection: 'asc' | 'desc';
  pageNumber: number;
  pageSize: number;
};
