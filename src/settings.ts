import dotenv from 'dotenv';
import { PagingParams } from './common/types/paging-params.js';
dotenv.config();

export const SETTINGS = {
  PORT: process.env.PORT || 3004,
  // PATH: {
  //   BLOGS: '/blogs',
  //   POSTS: '/posts',
  //   USERS: '/users',
  //   COMMENTS: '/comments',
  //   SESSIONS: '/sessions',
  // },
  DB_NAME: 'blogs',
  DB_COLLECTIONS: {
    BLOGS: 'blogs',
    POSTS: 'posts',
    USERS: 'users',
    COMMENTS: 'comments',
    COMMENT_LIKES: 'commentLikes',
    POST_LIKES: 'postLikes',
    SESSIONS: 'sessions',
    RATE_LIMITER: 'rateLimiter',
  },
  MONGO_URL: process.env.MONGO_URL || 'mongodb://0.0.0.0:27017',
  PAGING_DEFAULT_PARAMS: {
    sortBy: 'createdAt',
    sortDirection: 'desc',
    pageNumber: 1,
    pageSize: 10,
  } as PagingParams,
  CREDENTIALS: [{ login: 'admin', base64: 'YWRtaW46cXdlcnR5' }],
  EMAIL_CREDENTIALS: { user: process.env.EMAIL_LOGIN, password: process.env.EMAIL_PASSWORD },
  JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY,
  ACCESS_TOKEN_LIFETIME: '5 m',
  REFRESH_TOKEN_LIFETIME: '60 m',
  CONFIRMATION_CODE_LIFETIME: 24,
  RECOVERY_CODE_LIFETIME: 24,
  NEWEST_LIKES_NUMBER: 3,
};
