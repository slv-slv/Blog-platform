import dotenv from 'dotenv';
dotenv.config();

export const SETTINGS = {
  PORT: process.env.PORT || 3004,
  PATH: {
    BLOGS: '/blogs',
    POSTS: '/posts',
  },
  DB_NAME: 'blogs',
  DB_COLLECTIONS: {
    BLOGS: 'blogs',
    POSTS: 'posts',
  },
  MONGO_URL: process.env.MONGO_URL || 'mongodb://0.0.0.0:27017',
};
