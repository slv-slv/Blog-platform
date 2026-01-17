import 'reflect-metadata';
import { Container } from 'inversify';
import { BlogModel } from '../features/blogs/blogs-model.js';
import { PostModel } from '../features/posts/posts-model.js';
import { CommentModel } from '../features/comments/comments-model.js';
import { UserModel } from '../features/users/users-model.js';
import { SessionModel } from '../security/sessions/sessions-model.js';
import { RateLimiterModel } from '../security/rate-limiter/rate-limiter-model.js';
import { CommentLikesModel } from '../features/likes/comments/comment-likes-models.js';
import { PostLikesModel } from '../features/likes/posts/post-likes-models.js';

// Controllers
import { AuthController } from '../security/auth/auth-controller.js';
import { BlogsController } from '../features/blogs/blogs-controller.js';
import { PostsController } from '../features/posts/posts-controller.js';
import { CommentsController } from '../features/comments/comments-controller.js';
import { UsersController } from '../features/users/users-controller.js';
import { SessionsController } from '../security/sessions/sessions-controller.js';

// Services
import { AuthService } from '../security/auth/auth-service.js';
import { BlogsService } from '../features/blogs/blogs-service.js';
import { PostsService } from '../features/posts/posts-service.js';
import { CommentsService } from '../features/comments/comments-service.js';
import { UsersService } from '../features/users/users-service.js';
import { SessionsService } from '../security/sessions/sessions-service.js';
import { RateLimiterService } from '../security/rate-limiter/rate-limiter-service.js';
import { CommentLikesService } from '../features/likes/comments/comment-likes-service.js';
import { PostLikesService } from '../features/likes/posts/post-likes-service.js';
import { EmailService } from '../infrastructure/email/email-service.js';

// Repositories
import { BlogsRepo } from '../features/blogs/blogs-repo.js';
import { BlogsQueryRepo } from '../features/blogs/blogs-query-repo.js';
import { PostsRepo } from '../features/posts/posts-repo.js';
import { PostsQueryRepo } from '../features/posts/posts-query-repo.js';
import { CommentsRepo } from '../features/comments/comments-repo.js';
import { CommentsQueryRepo } from '../features/comments/comments-query-repo.js';
import { UsersRepo } from '../features/users/users-repo.js';
import { UsersQueryRepo } from '../features/users/users-query-repo.js';
import { SessionsRepo } from '../security/sessions/sessions-repo.js';
import { SessionsQueryRepo } from '../security/sessions/sessions-query-repo.js';
import { RateLimiterRepo } from '../security/rate-limiter/rate-limiter-repo.js';
import { CommentLikesRepo } from '../features/likes/comments/comment-likes-repo.js';
import { CommentLikesQueryRepo } from '../features/likes/comments/comment-likes-query-repo.js';
import { PostLikesRepo } from '../features/likes/posts/post-likes-repo.js';
import { PostLikesQueryRepo } from '../features/likes/posts/post-likes-query-repo.js';

export const container: Container = new Container({ defaultScope: 'Singleton' });

// Models
container.bind('BlogModel').toConstantValue(BlogModel);
container.bind('PostModel').toConstantValue(PostModel);
container.bind('CommentModel').toConstantValue(CommentModel);
container.bind('UserModel').toConstantValue(UserModel);
container.bind('SessionModel').toConstantValue(SessionModel);
container.bind('RateLimiterModel').toConstantValue(RateLimiterModel);
container.bind('CommentLikesModel').toConstantValue(CommentLikesModel);
container.bind('PostLikesModel').toConstantValue(PostLikesModel);

// Controllers
container.bind(AuthController).toSelf();
container.bind(BlogsController).toSelf();
container.bind(PostsController).toSelf();
container.bind(CommentsController).toSelf();
container.bind(UsersController).toSelf();
container.bind(SessionsController).toSelf();

// Services
container.bind(AuthService).toSelf();
container.bind(BlogsService).toSelf();
container.bind(PostsService).toSelf();
container.bind(CommentsService).toSelf();
container.bind(UsersService).toSelf();
container.bind(SessionsService).toSelf();
container.bind(RateLimiterService).toSelf();
container.bind(CommentLikesService).toSelf();
container.bind(PostLikesService).toSelf();
container.bind(EmailService).toSelf();

// Repositories
container.bind(BlogsRepo).toSelf();
container.bind(BlogsQueryRepo).toSelf();
container.bind(PostsRepo).toSelf();
container.bind(PostsQueryRepo).toSelf();
container.bind(CommentsRepo).toSelf();
container.bind(CommentsQueryRepo).toSelf();
container.bind(UsersRepo).toSelf();
container.bind(UsersQueryRepo).toSelf();
container.bind(SessionsRepo).toSelf();
container.bind(SessionsQueryRepo).toSelf();
container.bind(RateLimiterRepo).toSelf();
container.bind(CommentLikesRepo).toSelf();
container.bind(CommentLikesQueryRepo).toSelf();
container.bind(PostLikesRepo).toSelf();
container.bind(PostLikesQueryRepo).toSelf();
