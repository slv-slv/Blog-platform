import { db } from '../db/db.js';
import { BlogType } from '../types/blog-types.js';

export const blogsRepo = {
  getBlogs: (): BlogType[] => {
    return db.blogs;
  },

  findBlog: (id: string): BlogType | null => {
    const foundBlog = db.blogs.find((blog) => blog.id === id);
    if (!foundBlog) {
      return null;
    }
    return foundBlog;
  },

  createBlog: (blogProps: { name: string; description: string; websiteUrl: string }): BlogType => {
    const id = db.blogs.length ? Math.max(...db.blogs.map((blog) => +blog.id)) + 1 : 1;
    const newBlog = { id: id.toString(), ...blogProps };
    db.blogs.push(newBlog);
    return newBlog;
  },

  updateBlog: (id: string, blogProps: { name: string; description: string; websiteUrl: string }): boolean => {
    const blogIndex = db.blogs.findIndex((blog) => blog.id === id);
    if (blogIndex < 0) {
      return false;
    }
    Object.assign(db.blogs[blogIndex], blogProps);
    return true;
  },

  deleteBlog: (id: string): boolean => {
    const blogIndex = db.blogs.findIndex((blog) => blog.id === id);
    if (blogIndex < 0) {
      return false;
    }
    db.blogs.splice(blogIndex, 1);
    return true;
  },

  deleteAllBlogs: () => {
    db.blogs = [];
  },
};
