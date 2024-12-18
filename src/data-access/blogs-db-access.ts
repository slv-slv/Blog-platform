import { blogsDB } from '../db/blogs-db.js';
import { BlogType } from '../types/blog-types.js';

const getBlogsDb = (): BlogType[] => {
  return blogsDB;
};

const findBlogDb = (id: number): BlogType | null => {
  const foundBlog = blogsDB.find((blog) => blog.id === id);
  if (!foundBlog) {
    return null;
  }
  return foundBlog;
};

const createBlogDb = (blogProps: { name: string; description: string; websiteUrl: string }): BlogType => {
  const id = blogsDB.length ? Math.max(...blogsDB.map((blog) => blog.id)) + 1 : 1;
  return { id, ...blogProps };
};

const updateBlogDb = (id: number, blogProps: { name: string; description: string; websiteUrl: string }): boolean => {
  const blogIndex = blogsDB.findIndex((blog) => blog.id === id);
  if (blogIndex < 0) {
    return false;
  }
  Object.assign(blogsDB[blogIndex], blogProps);
  return true;
};

const deleteBlogDb = (id: number): boolean => {
  const blogIndex = blogsDB.findIndex((blog) => blog.id === id);
  if (blogIndex < 0) {
    return false;
  }
  blogsDB.splice(blogIndex, 1);
  return true;
};

export { getBlogsDb, findBlogDb, createBlogDb, updateBlogDb, deleteBlogDb };
