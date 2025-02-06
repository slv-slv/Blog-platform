import { AuthService } from '../security/auth/auth-service.js';
import { BlogsService } from '../features/blogs/blogs-service.js';
import { CommentsService } from '../features/comments/comments-service.js';
import { PostsService } from '../features/posts/posts-service.js';
import { UsersService } from '../features/users/users-service.js';
import { SessionsService } from '../security/sessions/sessions-service.js';
import { RequestLogsService } from '../security/request-logs/request-logs-service.js';

export const blogsService = new BlogsService();

export const postsService = new PostsService();

export const commentsService = new CommentsService();

export const usersService = new UsersService();

export const authService = new AuthService();

export const sessionsService = new SessionsService();

export const requestLogsService = new RequestLogsService();
