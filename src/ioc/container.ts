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

export const container: Container = new Container({ autoBindInjectable: true, defaultScope: 'Singleton' });

container.bind('BlogModel').toConstantValue(BlogModel);
container.bind('PostModel').toConstantValue(PostModel);
container.bind('CommentModel').toConstantValue(CommentModel);
container.bind('UserModel').toConstantValue(UserModel);
container.bind('SessionModel').toConstantValue(SessionModel);
container.bind('RateLimiterModel').toConstantValue(RateLimiterModel);
container.bind('CommentLikesModel').toConstantValue(CommentLikesModel);
container.bind('PostLikesModel').toConstantValue(PostLikesModel);
