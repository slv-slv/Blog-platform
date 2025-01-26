import { query } from 'express-validator';
import { BlogTypeKeys } from '../../features/blogs/blog-types.js';
import { PostTypeKeys } from '../../features/posts/post-types.js';
import { UserTypeKeys } from '../../features/users/user-types.js';
import { CommentTypeKeys } from '../../features/comments/comment-types.js';

export const pagingValidator = {
  blogsSortBy: query('sortBy')
    .optional()
    .isIn(Object.values(BlogTypeKeys))
    .withMessage('Invalid sortBy value'),

  postsSortBy: query('sortBy')
    .optional()
    .isIn(Object.values(PostTypeKeys))
    .withMessage('Invalid sortBy value'),

  usersSortBy: query('sortBy')
    .optional()
    .isIn(Object.values(UserTypeKeys))
    .withMessage('Invalid sortBy value'),

  commentsSortBy: query('sortBy')
    .optional()
    .isIn(Object.values(CommentTypeKeys))
    .withMessage('Invalid sortBy value'),

  sortDirection: query('sortDirection')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Invalid sortDirection value'),

  pageNumber: query('page').optional().isInt({ min: 1 }).withMessage('Invalid page number'),

  pageSize: query('pageSize').optional().isInt({ min: 1 }).withMessage('Invalid page size'),
};
