import { db } from '../db/db.js';
import { PostType } from '../types/posts-types.js';
import { blogsRepo } from './blogs-db-access.js';

export const postsRepo = {
  getPosts: (): PostType[] => {
    return db.posts;
  },

  findPost: (id: string): PostType | null => {
    const foundPost = db.posts.find((post) => post.id === id);
    if (!foundPost) {
      return null;
    }
    return foundPost;
  },

  createPost: (postProps: {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
  }): PostType | null => {
    const id = db.posts.length ? Math.max(...db.posts.map((post) => +post.id)) + 1 : 1;
    const blog = blogsRepo.findBlog(postProps.blogId);
    if (!blog) {
      return null;
    }
    const newPost = { id: id.toString(), ...postProps, blogName: blog.name };
    db.posts.push(newPost);
    return newPost;
  },

  updatePost: (
    id: string,
    postProps: {
      title: string;
      shortDescription: string;
      content: string;
      blogId: string;
    },
  ): boolean => {
    const postIndex = db.posts.findIndex((post) => post.id === id);
    if (postIndex < 0) {
      return false;
    }
    const blog = blogsRepo.findBlog(postProps.blogId);
    if (!blog) {
      return false;
    }
    db.posts[postIndex] = { ...db.posts[postIndex], ...postProps, blogName: blog.name };
    return true;
  },

  deletePost: (id: string): boolean => {
    const postIndex = db.posts.findIndex((post) => post.id === id);
    if (postIndex < 0) {
      return false;
    }
    db.posts.splice(postIndex, 1);
    return true;
  },

  deleteAllPosts: () => {
    db.posts = [];
  },
};
