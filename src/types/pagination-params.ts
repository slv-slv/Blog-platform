import { BlogType } from './blog-types.js';

export type PaginationParams = {
  sortBy: keyof BlogType;
  sortDirection: 'asc' | 'desc';
  pageNumber: number;
  pageSize: number;
};
