import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { dbName, mongoUri } from '../../infrastructure/db/db.js';
import { ObjectId } from 'mongodb';
import { SETTINGS } from '../../settings.js';
import { app } from '../../app.js';
import { HTTP_STATUS } from '../../common/types/http-status-codes.js';
import { container } from '../../ioc/container.js';
import { UsersService } from '../../features/users/users-service.js';
import mongoose from 'mongoose';
import { CommentsService } from '../../features/comments/comments-service.js';
import { PostsService } from '../../features/posts/posts-service.js';
import { BlogsService } from '../../features/blogs/blogs-service.js';

const blogsService = container.get(BlogsService);
const postsService = container.get(PostsService);
const usersService = container.get(UsersService);
const commentsService = container.get(CommentsService);

beforeAll(async () => {
  await mongoose.connect(mongoUri, { dbName });
  await mongoose.connection.dropDatabase();
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('GET COMMENT', () => {
  const login = 'NewUser';
  const email = 'example@gmail.com';
  const password = 'somepassword';

  let userId: string;
  let accessToken: string;
  let commentId: string;

  it('should return 200 and return comment by id', async () => {
    const insertedUser = await usersService.createUser(login, email, password);
    userId = insertedUser.data!.id;

    const payload = { userId };
    const secret = SETTINGS.JWT_PRIVATE_KEY!;
    accessToken = jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: '15 m' });

    const blog = await blogsService.createBlog('blog title', 'blog description', 'example@google.ru');
    const blogId = blog.id;

    const post = await postsService.createPost('post title', 'description', 'long boring text', blogId);
    const postId = post.data!.id;

    const content = 'long boring comment';

    const comment = await commentsService.createComment(postId, content, userId);
    commentId = comment.data!.id;

    const response = await request(app).get(`/comments/${commentId}`).expect(HTTP_STATUS.OK_200);
    expect(Object.keys(response.body)).toHaveLength(5);
  });

  it('should return 404 if the comment is not found', async () => {
    const incorrectPostId = new ObjectId();
    await request(app).get(`/comments/${incorrectPostId}`).expect(HTTP_STATUS.NOT_FOUND_404);

    await commentsService.deleteComment(commentId, userId);
    await request(app).get(`/comments/${commentId}`).expect(HTTP_STATUS.NOT_FOUND_404);
  });
});
