import { BlogsQueryRepo } from '../features/blogs/blogs-query-repo.js';
import { BlogsRepo } from '../features/blogs/blogs-repo.js';
import { CommentsQueryRepo } from '../features/comments/comments-query-repo.js';
import { CommentsRepo } from '../features/comments/comments-repo.js';
import { PostsQueryRepo } from '../features/posts/posts-query-repo.js';
import { PostsRepo } from '../features/posts/posts-repo.js';
import { UsersQueryRepo } from '../features/users/users-query-repo.js';
import { UsersRepo } from '../features/users/users-repo.js';
import { SessionsQueryRepo } from '../security/sessions/sessions-query-repo.js';
import { SessionsRepo } from '../security/sessions/sessions-repo.js';
import { RequestLogsRepo } from '../security/request-logs/request-logs-repo.js';
import {
  blogsColl,
  commentsColl,
  postsColl,
  requestLogsColl,
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

export const sessionsQueryRepo = new SessionsQueryRepo(sessionsColl);
export const sessionsRepo = new SessionsRepo(sessionsColl);

export const requestLogsRepo = new RequestLogsRepo(requestLogsColl);
