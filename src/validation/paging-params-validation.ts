import { query } from 'express-validator';
import { BlogTypeKeys } from '../features/blogs/blog-types.js';
import { PostTypeKeys } from '../features/posts/post-types.js';
import { UserTypeKeys } from '../features/users/user-types.js';

export const blogsSortByValidation = query('sortBy')
  .optional()
  .isIn(Object.values(BlogTypeKeys))
  .withMessage('Invalid sortBy value');

export const postsSortByValidation = query('sortBy')
  .optional()
  .isIn(Object.values(PostTypeKeys))
  .withMessage('Invalid sortBy value');

export const usersSortByValidation = query('sortBy')
  .optional()
  .isIn(Object.values(UserTypeKeys))
  .withMessage('Invalid sortBy value');

export const sortDirectionValidation = query('sortDirection')
  .optional()
  .isIn(['asc', 'desc'])
  .withMessage('Invalid sortDirection value');

export const pageNumberValidation = query('page').optional().isInt({ min: 1 }).withMessage('Invalid page number');

export const pageSizeValidation = query('pageSize').optional().isInt({ min: 1 }).withMessage('Invalid page size');
