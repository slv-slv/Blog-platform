import { db } from '../db/db.js';
import { BlogType } from '../types/blog-types.js';

const getBlogsDb = (): BlogType[] => {
  return db.blogs;
};

const findBlogDb = (id: number): BlogType | null => {
  const foundBlog = db.blogs.find((blog) => blog.id === id);
  if (!foundBlog) {
    return null;
  }
  return foundBlog;
};

const createBlogDb = (blogProps: { name: string; description: string; websiteUrl: string }): BlogType => {
  const id = db.blogs.length ? Math.max(...db.blogs.map((blog) => blog.id)) + 1 : 1;
  const newBlog = { id, ...blogProps };
  db.blogs.push(newBlog);
  return newBlog;
};

const updateBlogDb = (id: number, blogProps: { name: string; description: string; websiteUrl: string }): boolean => {
  const blogIndex = db.blogs.findIndex((blog) => blog.id === id);
  if (blogIndex < 0) {
    return false;
  }
  Object.assign(db.blogs[blogIndex], blogProps);
  return true;
};

const deleteBlogDb = (id: number): boolean => {
  const blogIndex = db.blogs.findIndex((blog) => blog.id === id);
  if (blogIndex < 0) {
    return false;
  }
  db.blogs.splice(blogIndex, 1);
  return true;
};

const deleteAllBlogsDb = () => {
  db.blogs = [];
};

export { getBlogsDb, findBlogDb, createBlogDb, updateBlogDb, deleteBlogDb, deleteAllBlogsDb };
