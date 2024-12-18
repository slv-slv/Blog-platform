import { postsDB } from '../db/posts-db.js';
import { postType } from '../types/posts-types.js';
import { getBlogById } from './blogs-db-access.js';

const getAllPosts = (): postType[] => {
  return postsDB;
};

const getPostById = (id: number): postType | null => {
  const foundPost = postsDB.find((post) => post.id === id);
  if (!foundPost) {
    return null;
  }
  return foundPost;
};

const createPost = (postProps: {
  title: string;
  shortDescription: string;
  content: string;
  blogId: number;
}): postType | null => {
  const id = postsDB.length ? Math.max(...postsDB.map((post) => post.id)) + 1 : 1;
  const blog = getBlogById(postProps.blogId);
  if (!blog) {
    return null;
  }
  return { id, ...postProps, blogName: blog.name };
};

const updatePost = (
  id: number,
  postProps: {
    title: string;
    shortDescription: string;
    content: string;
    blogId: number;
  },
): boolean => {
  const postIndex = postsDB.findIndex((post) => post.id === id);
  if (postIndex < 0) {
    return false;
  }
  const blog = getBlogById(postProps.blogId);
  if (!blog) {
    return false;
  }
  postsDB[postIndex] = { ...postsDB[postIndex], ...postProps, blogName: blog.name };
  return true;
};

const deletePost = (id: number): boolean => {
  const postIndex = postsDB.findIndex((post) => post.id === id);
  if (postIndex < 0) {
    return false;
  }
  postsDB.splice(postIndex, 1);
  return true;
};

export { getAllPosts, getPostById, createPost, updatePost, deletePost };
