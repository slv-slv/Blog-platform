import dotenv from 'dotenv';
import { PagingParams } from './common/types/paging-params.js';
dotenv.config();

export const SETTINGS = {
  PORT: process.env.PORT || 3004,
  PATH: {
    BLOGS: '/blogs',
    POSTS: '/posts',
    USERS: '/users',
  },
  DB_NAME: 'blogs',
  DB_COLLECTIONS: {
    BLOGS: 'blogs',
    POSTS: 'posts',
    USERS: 'users',
  },
  MONGO_URL: process.env.MONGO_URL || 'mongodb://0.0.0.0:27017',
  PAGING_DEFAULT_PARAMS: {
    sortBy: 'createdAt',
    sortDirection: 'desc',
    pageNumber: 1,
    pageSize: 10,
  } as PagingParams,
  CREDENTIALS: [{ login: 'admin', base64: 'YWRtaW46cXdlcnR5' }],
};
