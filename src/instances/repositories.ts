import { BlogsQueryRepo } from '../features/blogs/blogs-query-repo.js';
import { BlogsRepo } from '../features/blogs/blogs-repo.js';
import { CommentsQueryRepo } from '../features/comments/comments-query-repo.js';
import { CommentsRepo } from '../features/comments/comments-repo.js';
import { PostsQueryRepo } from '../features/posts/posts-query-repo.js';
import { PostsRepo } from '../features/posts/posts-repo.js';
import { SessionsRepo } from '../features/sessions/sessions-repo.js';
import { UsersQueryRepo } from '../features/users/users-query-repo.js';
import { UsersRepo } from '../features/users/users-repo.js';
import {
  blogsColl,
  commentsColl,
  postsColl,
  sessionsColl,
  usersColl,
} from '../infrastructure/db/collections.js';

export const blogsQueryRepo = new BlogsQueryRepo(blogsColl);
export const blogsRepo = new BlogsRepo(blogsColl);

export const postsQueryRepo = new PostsQueryRepo(postsColl);
export const postsRepo = new PostsRepo(postsColl);

export const commentsQueryRepo = new CommentsQueryRepo(commentsColl);
export const commentsRepo = new CommentsRepo(commentsColl);

export const usersQueryRepo = new UsersQueryRepo(usersColl);
export const usersRepo = new UsersRepo(usersColl);

export const sessionsRepo = new SessionsRepo(sessionsColl);
