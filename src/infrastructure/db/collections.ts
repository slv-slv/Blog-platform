import { BlogDbType } from '../../features/blogs/blogs-types.js';
import { CommentDbType } from '../../features/comments/comments-types.js';
import { PostDbType } from '../../features/posts/posts-types.js';
import { SessionType } from '../../security/sessions/sessions-types.js';
import { UserDbType } from '../../features/users/users-types.js';
import { SETTINGS } from '../../settings.js';
import { db } from './db.js';
import { RequestLogType } from '../../security/request-logs/request-logs-types.js';

export const blogsCollection = db.collection<BlogDbType>(SETTINGS.DB_COLLECTIONS.BLOGS);
export const postsCollection = db.collection<PostDbType>(SETTINGS.DB_COLLECTIONS.POSTS);
export const commentsCollection = db.collection<CommentDbType>(SETTINGS.DB_COLLECTIONS.COMMENTS);
export const usersCollection = db.collection<UserDbType>(SETTINGS.DB_COLLECTIONS.USERS);
export const sessionsCollection = db.collection<SessionType>(SETTINGS.DB_COLLECTIONS.SESSIONS);
export const requestLogsCollection = db.collection<RequestLogType>(SETTINGS.DB_COLLECTIONS.REQUEST_LOGS);
