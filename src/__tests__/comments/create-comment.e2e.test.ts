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
import { BlogsService } from '../../features/blogs/blogs-service.js';
import { PostsService } from '../../features/posts/posts-service.js';

const blogsService = container.get(BlogsService);
const postsService = container.get(PostsService);
const usersService = container.get(UsersService);

beforeAll(async () => {
  await mongoose.connect(mongoUri, { dbName });
  await mongoose.connection.dropDatabase();
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('CREATE COMMENT', () => {
  const login = 'NewUser';
  const email = 'example@gmail.com';
  const password = 'somepassword';

  let postId: string;
  let accessToken: string;

  it('should return 201 and return created comment', async () => {
    const insertedUser = await usersService.createUser(login, email, password);
    const userId = insertedUser.data!.id;

    const payload = { userId };
    const secret = SETTINGS.JWT_PRIVATE_KEY!;
    accessToken = jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: '15 m' });

    const blog = await blogsService.createBlog('blog name', 'blog description', 'https://www.example.com');
    const blogId = blog.id;

    const post = await postsService.createPost('post title', 'description', 'long boring text', blogId);
    postId = post.data!.id;

    const response = await request(app)
      .post(`/posts/${postId}/comments`)
      .auth(accessToken, { type: 'bearer' })
      .send({ content: 'very long boring content' })
      .expect(HTTP_STATUS.CREATED_201);

    expect(Object.keys(response.body)).toHaveLength(5);

    expect(response.body.commentatorInfo.userId).toBe(userId);
  });

  it('should return 401 if no access token has been sent', async () => {
    await request(app)
      .post(`/posts/${postId}/comments`)
      .send({ content: 'very long boring content' })
      .expect(HTTP_STATUS.UNAUTHORIZED_401);
  });

  // it('should return 401 if an invalid access token is sent', async () => {
  //   const login = 'AnotherUser';
  //   const email = 'another_user@gmail.com';
  //   const password = 'somepassword';

  //   const insertedUser = await usersService.createUser(login, email, password);
  //   const anotherUserId = insertedUser.data!.id;

  //   const payload = { anotherUserId };
  //   const secret = SETTINGS.JWT_PRIVATE_KEY!;
  //   const anotherUserToken = jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: '15 m' });

  //   await request(app)
  //     .post(`/posts/${postId}/comments`)
  //     .auth(anotherUserToken, { type: 'bearer' })
  //     .send({ content: 'very long boring content' })
  //     .expect(HTTP_STATUS.UNAUTHORIZED_401);
  // });

  it('should return 404 if the post is not found', async () => {
    const incorrectPostId = new ObjectId();
    await request(app)
      .post(`/posts/${incorrectPostId}/comments`)
      .auth(accessToken, { type: 'bearer' })
      .send({ content: 'very long boring content' })
      .expect(HTTP_STATUS.NOT_FOUND_404);
  });
});
