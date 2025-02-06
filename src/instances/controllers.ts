import { BlogsController } from '../features/blogs/blogs-controller.js';
import { CommentsController } from '../features/comments/comments-controller.js';
import { PostsController } from '../features/posts/posts-controller.js';
import { UsersController } from '../features/users/users-controller.js';
import { AuthController } from '../security/auth/auth-controller.js';
import { SecurityController } from '../security/security-controller.js';

export const blogsController = new BlogsController();

export const postsController = new PostsController();

export const commentsController = new CommentsController();

export const usersController = new UsersController();

export const authController = new AuthController();

export const securityController = new SecurityController();
