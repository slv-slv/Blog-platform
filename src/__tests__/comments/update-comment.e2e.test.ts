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
import { CommentsService } from '../../features/comments/comments-service.js';

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

describe('UPDATE COMMENT', () => {
  const login = 'NewUser';
  const email = 'example@gmail.com';
  const password = 'somepassword';

  let userId: string;
  let accessToken: string;
  let commentId: string;
  let postId: string;

  beforeAll(async () => {
    // Create user
    const insertedUser = await usersService.createUser(login, email, password);
    userId = insertedUser.data!.id;

    const payload = { sub: userId };
    const secret = SETTINGS.JWT_PRIVATE_KEY!;
    accessToken = jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: '15m' });

    // Create blog
    const blog = await blogsService.createBlog('blog name', 'blog description', 'https://www.example.com');
    const blogId = blog.id;

    // Create post
    const post = await postsService.createPost('post title', 'description', 'long boring text', blogId);
    postId = post.data!.id;

    // Create comment
    const comment = await commentsService.createComment(postId, 'very long boring content', userId);
    commentId = comment.data!.id;
  });

  it('should return 204 and update comment', async () => {
    const updatedContent = 'updated very long boring content';

    await request(app)
      .put(`/comments/${commentId}`)
      .auth(accessToken, { type: 'bearer' })
      .send({ content: updatedContent })
      .expect(HTTP_STATUS.NO_CONTENT_204);

    // Verify the comment was updated
    const response = await request(app).get(`/comments/${commentId}`).expect(HTTP_STATUS.OK_200);

    expect(response.body.content).toBe(updatedContent);
    expect(response.body.commentatorInfo.userId).toBe(userId);
  });

  it('should return 400 if content is too short', async () => {
    const response = await request(app)
      .put(`/comments/${commentId}`)
      .auth(accessToken, { type: 'bearer' })
      .send({ content: 'short' })
      .expect(HTTP_STATUS.BAD_REQUEST_400);

    expect(response.body.errorsMessages).toBeDefined();
    expect(response.body.errorsMessages).toHaveLength(1);
    expect(response.body.errorsMessages[0].field).toBe('content');
  });

  it('should return 400 if content is too long', async () => {
    const longContent = 'a'.repeat(301);

    const response = await request(app)
      .put(`/comments/${commentId}`)
      .auth(accessToken, { type: 'bearer' })
      .send({ content: longContent })
      .expect(HTTP_STATUS.BAD_REQUEST_400);

    expect(response.body.errorsMessages).toBeDefined();
    expect(response.body.errorsMessages).toHaveLength(1);
    expect(response.body.errorsMessages[0].field).toBe('content');
  });

  it('should return 400 if content is empty', async () => {
    const response = await request(app)
      .put(`/comments/${commentId}`)
      .auth(accessToken, { type: 'bearer' })
      .send({ content: '' })
      .expect(HTTP_STATUS.BAD_REQUEST_400);

    expect(response.body.errorsMessages).toBeDefined();
    expect(response.body.errorsMessages[0].field).toBe('content');
  });

  it('should return 400 if content is missing', async () => {
    const response = await request(app)
      .put(`/comments/${commentId}`)
      .auth(accessToken, { type: 'bearer' })
      .send({})
      .expect(HTTP_STATUS.BAD_REQUEST_400);

    expect(response.body.errorsMessages).toBeDefined();
    expect(response.body.errorsMessages[0].field).toBe('content');
  });

  it('should return 401 if no access token has been sent', async () => {
    await request(app)
      .put(`/comments/${commentId}`)
      .send({ content: 'very long boring content' })
      .expect(HTTP_STATUS.UNAUTHORIZED_401);
  });

  it('should return 401 if access token is invalid', async () => {
    const invalidToken = 'invalid.token.here';

    await request(app)
      .put(`/comments/${commentId}`)
      .auth(invalidToken, { type: 'bearer' })
      .send({ content: 'very long boring content' })
      .expect(HTTP_STATUS.UNAUTHORIZED_401);
  });

  it("should return 403 if user tries to update another user's comment", async () => {
    // Create another user
    const anotherLogin = 'AnotherUser';
    const anotherEmail = 'another@gmail.com';
    const anotherPassword = 'anotherpassword';

    const insertedAnotherUser = await usersService.createUser(anotherLogin, anotherEmail, anotherPassword);
    const anotherUserId = insertedAnotherUser.data!.id;

    const payload = { sub: anotherUserId };
    const secret = SETTINGS.JWT_PRIVATE_KEY!;
    const anotherUserToken = jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: '15m' });

    const response = await request(app)
      .put(`/comments/${commentId}`)
      .auth(anotherUserToken, { type: 'bearer' })
      .send({ content: 'trying to update someone else comment' })
      .expect(HTTP_STATUS.FORBIDDEN_403);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toHaveProperty('message');
    expect(response.body[0]).toHaveProperty('field');
  });

  it('should return 404 if the comment is not found', async () => {
    const incorrectCommentId = new ObjectId();

    const response = await request(app)
      .put(`/comments/${incorrectCommentId}`)
      .auth(accessToken, { type: 'bearer' })
      .send({ content: 'very long boring content' })
      .expect(HTTP_STATUS.NOT_FOUND_404);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toHaveProperty('message');
    expect(response.body[0]).toHaveProperty('field');
  });

  it('should return 404 if comment was deleted', async () => {
    // Create a new comment to delete
    const comment = await commentsService.createComment(
      postId,
      'comment to be deleted and then updated',
      userId,
    );
    const commentToDeleteId = comment.data!.id;

    // Delete the comment
    await commentsService.deleteComment(commentToDeleteId, userId);

    // Try to update deleted comment
    const response = await request(app)
      .put(`/comments/${commentToDeleteId}`)
      .auth(accessToken, { type: 'bearer' })
      .send({ content: 'trying to update deleted comment' })
      .expect(HTTP_STATUS.NOT_FOUND_404);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toHaveProperty('message');
    expect(response.body[0]).toHaveProperty('field');
  });
});
