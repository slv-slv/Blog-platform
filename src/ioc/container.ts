import 'reflect-metadata';
import { Container } from 'inversify';
import {
  blogsCollection,
  postsCollection,
  commentsCollection,
  usersCollection,
  sessionsCollection,
  requestLogsCollection,
} from '../infrastructure/db/collections.js';
import { BlogsRepo } from '../features/blogs/blogs-repo.js';
import { PostsRepo } from '../features/posts/posts-repo.js';
import { CommentsRepo } from '../features/comments/comments-repo.js';
import { UsersRepo } from '../features/users/users-repo.js';
import { RequestLogsRepo } from '../security/request-logs/request-logs-repo.js';
import { BlogsQueryRepo } from '../features/blogs/blogs-query-repo.js';
import { PostsQueryRepo } from '../features/posts/posts-query-repo.js';
import { CommentsQueryRepo } from '../features/comments/comments-query-repo.js';
import { UsersQueryRepo } from '../features/users/users-query-repo.js';
import { SessionsQueryRepo } from '../security/sessions/sessions-query-repo.js';
import { BlogsService } from '../features/blogs/blogs-service.js';
import { PostsService } from '../features/posts/posts-service.js';
import { CommentsService } from '../features/comments/comments-service.js';
import { UsersService } from '../features/users/users-service.js';
import { SessionsRepo } from '../security/sessions/sessions-repo.js';
import { AuthService } from '../security/auth/auth-service.js';
import { EmailService } from '../infrastructure/email/email-service.js';
import { SessionsService } from '../security/sessions/sessions-service.js';
import { RequestLogsService } from '../security/request-logs/request-logs-service.js';
import { BlogsController } from '../features/blogs/blogs-controller.js';
import { PostsController } from '../features/posts/posts-controller.js';
import { CommentsController } from '../features/comments/comments-controller.js';
import { UsersController } from '../features/users/users-controller.js';
import { AuthController } from '../security/auth/auth-controller.js';
import { SessionsController } from '../security/sessions/sessions-controller.js';

export const container: Container = new Container();

container.bind('BlogsCollection').toConstantValue(blogsCollection);
container.bind('PostsCollection').toConstantValue(postsCollection);
container.bind('CommentsCollection').toConstantValue(commentsCollection);
container.bind('UsersCollection').toConstantValue(usersCollection);
container.bind('SessionsCollection').toConstantValue(sessionsCollection);
container.bind('RequestLogsCollection').toConstantValue(requestLogsCollection);

container.bind(BlogsRepo).toSelf().inSingletonScope();
container.bind(PostsRepo).toSelf().inSingletonScope();
container.bind(CommentsRepo).toSelf().inSingletonScope();
container.bind(UsersRepo).toSelf().inSingletonScope();
container.bind(SessionsRepo).toSelf().inSingletonScope();
container.bind(RequestLogsRepo).toSelf().inSingletonScope();

container.bind(BlogsQueryRepo).toSelf().inSingletonScope();
container.bind(PostsQueryRepo).toSelf().inSingletonScope();
container.bind(CommentsQueryRepo).toSelf().inSingletonScope();
container.bind(UsersQueryRepo).toSelf().inSingletonScope();
container.bind(SessionsQueryRepo).toSelf().inSingletonScope();

container.bind(BlogsService).toSelf().inSingletonScope();
container.bind(PostsService).toSelf().inSingletonScope();
container.bind(CommentsService).toSelf().inSingletonScope();
container.bind(UsersService).toSelf().inSingletonScope();
container.bind(AuthService).toSelf().inSingletonScope();
container.bind(EmailService).toSelf().inSingletonScope();
container.bind(SessionsService).toSelf().inSingletonScope();
container.bind(RequestLogsService).toSelf().inSingletonScope();

container.bind(BlogsController).toSelf().inSingletonScope();
container.bind(PostsController).toSelf().inSingletonScope();
container.bind(CommentsController).toSelf().inSingletonScope();
container.bind(UsersController).toSelf().inSingletonScope();
container.bind(AuthController).toSelf().inSingletonScope();
container.bind(SessionsController).toSelf().inSingletonScope();
