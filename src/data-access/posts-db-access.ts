import { postsDB } from '../db/posts-db.js';
import { PostType } from '../types/posts-types.js';
import { findBlogDb } from './blogs-db-access.js';

const getPostsDb = (): PostType[] => {
  return postsDB;
};

const findPostDb = (id: number): PostType | null => {
  const foundPost = postsDB.find((post) => post.id === id);
  if (!foundPost) {
    return null;
  }
  return foundPost;
};

const createPostDb = (postProps: {
  title: string;
  shortDescription: string;
  content: string;
  blogId: number;
}): PostType | null => {
  const id = postsDB.length ? Math.max(...postsDB.map((post) => post.id)) + 1 : 1;
  const blog = findBlogDb(postProps.blogId);
  if (!blog) {
    return null;
  }
  return { id, ...postProps, blogName: blog.name };
};

const updatePostDb = (
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
  const blog = findBlogDb(postProps.blogId);
  if (!blog) {
    return false;
  }
  postsDB[postIndex] = { ...postsDB[postIndex], ...postProps, blogName: blog.name };
  return true;
};

const deletePostDb = (id: number): boolean => {
  const postIndex = postsDB.findIndex((post) => post.id === id);
  if (postIndex < 0) {
    return false;
  }
  postsDB.splice(postIndex, 1);
  return true;
};

export { getPostsDb, findPostDb, createPostDb, updatePostDb, deletePostDb };
