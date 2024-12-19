import { db } from '../db/db.js';
import { PostType } from '../types/posts-types.js';
import { findBlogDb } from './blogs-db-access.js';

const getPostsDb = (): PostType[] => {
  return db.posts;
};

const findPostDb = (id: string): PostType | null => {
  const foundPost = db.posts.find((post) => post.id === id);
  if (!foundPost) {
    return null;
  }
  return foundPost;
};

const createPostDb = (postProps: {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
}): PostType | null => {
  const id = db.posts.length ? Math.max(...db.posts.map((post) => +post.id)) + 1 : 1;
  const blog = findBlogDb(postProps.blogId);
  if (!blog) {
    return null;
  }
  const newPost = { id: id.toString(), ...postProps, blogName: blog.name };
  db.posts.push(newPost);
  return newPost;
};

const updatePostDb = (
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
  const blog = findBlogDb(postProps.blogId);
  if (!blog) {
    return false;
  }
  db.posts[postIndex] = { ...db.posts[postIndex], ...postProps, blogName: blog.name };
  return true;
};

const deletePostDb = (id: string): boolean => {
  const postIndex = db.posts.findIndex((post) => post.id === id);
  if (postIndex < 0) {
    return false;
  }
  db.posts.splice(postIndex, 1);
  return true;
};

const deleteAllPostsDb = () => {
  db.posts = [];
};

export { getPostsDb, findPostDb, createPostDb, updatePostDb, deletePostDb, deleteAllPostsDb };
