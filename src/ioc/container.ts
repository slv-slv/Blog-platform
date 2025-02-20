import 'reflect-metadata';
import { Container } from 'inversify';
// import {
//   blogsCollection,
//   postsCollection,
//   commentsCollection,
//   usersCollection,
//   sessionsCollection,
//   requestLogsCollection,
// } from '../infrastructure/db/collections.js';
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
import { BlogModel } from '../features/blogs/blogs-model.js';
import { PostModel } from '../features/posts/posts-model.js';
import { CommentModel } from '../features/comments/comments-model.js';
import { UserModel } from '../features/users/users-model.js';
import { SessionModel } from '../security/sessions/sessions-model.js';
import { RequestLogModel } from '../security/request-logs/request-logs-model.js';
import { CommentLikesModel } from '../features/likes/likes-models.js';

export const container: Container = new Container({ autoBindInjectable: true, defaultScope: 'Singleton' });

container.bind('BlogModel').toConstantValue(BlogModel);
container.bind('PostModel').toConstantValue(PostModel);
container.bind('CommentModel').toConstantValue(CommentModel);
container.bind('UserModel').toConstantValue(UserModel);
container.bind('SessionModel').toConstantValue(SessionModel);
container.bind('RequestLogModel').toConstantValue(RequestLogModel);
container.bind('CommentLikesModel').toConstantValue(CommentLikesModel);

// container.bind('BlogsCollection').toConstantValue(blogsCollection);
// container.bind('PostsCollection').toConstantValue(postsCollection);
// container.bind('CommentsCollection').toConstantValue(commentsCollection);
// container.bind('UsersCollection').toConstantValue(usersCollection);
// container.bind('SessionsCollection').toConstantValue(sessionsCollection);
// container.bind('RequestLogsCollection').toConstantValue(requestLogsCollection);

// container.bind(BlogsRepo).toSelf();
// container.bind(PostsRepo).toSelf();
// container.bind(CommentsRepo).toSelf();
// container.bind(UsersRepo).toSelf();
// container.bind(SessionsRepo).toSelf();
// container.bind(RequestLogsRepo).toSelf();

// container.bind(BlogsQueryRepo).toSelf();
// container.bind(PostsQueryRepo).toSelf();
// container.bind(CommentsQueryRepo).toSelf();
// container.bind(UsersQueryRepo).toSelf();
// container.bind(SessionsQueryRepo).toSelf();

// container.bind(BlogsService).toSelf();
// container.bind(PostsService).toSelf();
// container.bind(CommentsService).toSelf();
// container.bind(UsersService).toSelf();
// container.bind(AuthService).toSelf();
// container.bind(EmailService).toSelf();
// container.bind(SessionsService).toSelf();
// container.bind(RequestLogsService).toSelf();

// container.bind(BlogsController).toSelf();
// container.bind(PostsController).toSelf();
// container.bind(CommentsController).toSelf();
// container.bind(UsersController).toSelf();
// container.bind(AuthController).toSelf();
// container.bind(SessionsController).toSelf();
