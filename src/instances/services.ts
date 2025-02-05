import { AuthService } from '../auth/auth-service.js';
import { BlogsService } from '../features/blogs/blogs-service.js';
import { CommentsService } from '../features/comments/comments-service.js';
import { PostsService } from '../features/posts/posts-service.js';
import { UsersService } from '../features/users/users-service.js';

export const blogsService = new BlogsService();

export const postsService = new PostsService();

export const commentsService = new CommentsService();

export const usersService = new UsersService();

export const authService = new AuthService();
