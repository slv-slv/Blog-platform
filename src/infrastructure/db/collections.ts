import { Collection } from 'mongodb';
import { BlogType } from '../../features/blogs/blogs-types.js';
import { CommentDbType } from '../../features/comments/comments-types.js';
import { PostType } from '../../features/posts/posts-types.js';
import { SessionDbType } from '../../security/sessions/sessions-types.js';
import { UserDbType } from '../../features/users/users-types.js';
import { SETTINGS } from '../../settings.js';
import { db } from './db.js';
import { RequestLogDbType } from '../../security/request-logs/request-logs-types.js';

export const blogsColl = db.collection<BlogType>(SETTINGS.DB_COLLECTIONS.BLOGS);

export const postsColl = db.collection<PostType>(SETTINGS.DB_COLLECTIONS.POSTS);

export const commentsColl = db.collection<CommentDbType>(SETTINGS.DB_COLLECTIONS.COMMENTS);

export const usersColl = db.collection<UserDbType>(SETTINGS.DB_COLLECTIONS.USERS);

export const sessionsColl = db.collection<SessionDbType>(SETTINGS.DB_COLLECTIONS.SESSIONS);

export const requestLogsColl = db.collection<RequestLogDbType>(SETTINGS.DB_COLLECTIONS.REQUEST_LOGS);

// export let blogsColl: Collection<BlogType>;

// export let postsColl: Collection<PostType>;

// export let commentsColl: Collection<CommentDbType>;

// export let usersColl: Collection<UserDbType>;

// export let sessionsColl: Collection<SessionDbType>;

// export const initCollections = () => {
//   blogsColl = db.collection<BlogType>(SETTINGS.DB_COLLECTIONS.BLOGS);
//   postsColl = db.collection<PostType>(SETTINGS.DB_COLLECTIONS.POSTS);
//   commentsColl = db.collection<CommentDbType>(SETTINGS.DB_COLLECTIONS.COMMENTS);
//   usersColl = db.collection<UserDbType>(SETTINGS.DB_COLLECTIONS.USERS);
//   sessionsColl = db.collection<SessionDbType>(SETTINGS.DB_COLLECTIONS.SESSIONS);
// };
