import { blogsDB } from '../db/blogs-db.js';
import { blogType } from '../types/blogs-types.js';

const getAllBlogs = (): blogType[] => {
  return blogsDB;
};

const getBlogById = (id: number): blogType | null => {
  const foundBlog = blogsDB.find((blog) => blog.id === id);
  if (!foundBlog) {
    return null;
  }
  return foundBlog;
};

const createBlog = (blogProps: { name: string; description: string; websiteUrl: string }): blogType => {
  const id = blogsDB.length ? Math.max(...blogsDB.map((blog) => blog.id)) + 1 : 1;
  return { id, ...blogProps };
};

const updateBlog = (id: number, blogProps: { name: string; description: string; websiteUrl: string }): boolean => {
  const blogIndex = blogsDB.findIndex((blog) => blog.id === id);
  if (blogIndex < 0) {
    return false;
  }
  Object.assign(blogsDB[blogIndex], blogProps);
  return true;
};

const deleteBlog = (id: number): boolean => {
  const blogIndex = blogsDB.findIndex((blog) => blog.id === id);
  if (blogIndex < 0) {
    return false;
  }
  blogsDB.splice(blogIndex, 1);
  return true;
};
