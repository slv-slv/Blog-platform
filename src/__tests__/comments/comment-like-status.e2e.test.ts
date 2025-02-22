import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { dbName, mongoUri } from '../../infrastructure/db/db.js';
import { ObjectId } from 'mongodb';
import { SETTINGS } from '../../settings.js';
import { app } from '../../app.js';
import { HTTP_STATUS } from '../../common/types/http-status-codes.js';
import { container } from '../../ioc/container.js';
import { BlogsRepo } from '../../features/blogs/blogs-repo.js';
import { PostsRepo } from '../../features/posts/posts-repo.js';
import { UsersService } from '../../features/users/users-service.js';
import mongoose from 'mongoose';
import { CommentsService } from '../../features/comments/comments-service.js';
import { UsersQueryRepo } from '../../features/users/users-query-repo.js';

const blogsRepo = container.get(BlogsRepo);
const postsRepo = container.get(PostsRepo);
const usersQueryRepo = container.get(UsersQueryRepo);
const usersService = container.get(UsersService);
const commentsService = container.get(CommentsService);

beforeAll(async () => {
  await mongoose.connect(mongoUri, { dbName });
  await mongoose.connection.dropDatabase();
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('LIKE STATUS', () => {
  const login = 'NewUser';
  const email = 'example@gmail.com';
  const password = 'somepassword';

  let postId: string;
  let accessToken: string;
  let commentId: string;

  it('should return 401 if no access token has been sent', async () => {
    const insertedUser = await usersService.createUser(login, email, password);
    const userId = insertedUser.id;

    const payload = { userId };
    const secret = SETTINGS.JWT_PRIVATE_KEY!;
    accessToken = jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: '15 m' });

    const blog = await blogsRepo.createBlog(
      'blog name',
      'blog description',
      'https://www.example.com',
      new Date().toISOString(),
      false,
    );

    const post = await postsRepo.createPost(
      'post title',
      'description',
      'long boring text',
      blog.id,
      new Date().toISOString(),
    );

    postId = post.id;

    const currentUser = await usersQueryRepo.getCurrentUser(userId);
    const comment = await commentsService.createComment(postId, 'long boring content', currentUser!);

    commentId = comment.data.id;

    await request(app)
      .put(`/comments/${commentId}/like-status`)
      .send({ likeStatus: 'Like' })
      .expect(HTTP_STATUS.UNAUTHORIZED_401);
  });

  it('should return 404 if the comment is not found', async () => {
    const notExistingId = new ObjectId().toString();
    await request(app)
      .put(`/comments/${notExistingId}/like-status`)
      .auth(accessToken, { type: 'bearer' })
      .send({ likeStatus: 'Like' })
      .expect(HTTP_STATUS.NOT_FOUND_404);
  });

  it('should return 400 if body has incorrect values', async () => {
    const notExistingId = new ObjectId().toString();
    await request(app)
      .put(`/comments/${notExistingId}/like-status`)
      .auth(accessToken, { type: 'bearer' })
      .send({ likeStatus: 'SuperLike' })
      .expect(HTTP_STATUS.BAD_REQUEST_400);
  });

  it('should return 204 and change like status', async () => {
    await request(app)
      .put(`/comments/${commentId}/like-status`)
      .auth(accessToken, { type: 'bearer' })
      .send({ likeStatus: 'Like' })
      .expect(HTTP_STATUS.NO_CONTENT_204);

    const response = await request(app).get(`/comments/${commentId}`).auth(accessToken, { type: 'bearer' });
    const comment = response.body;

    expect(comment?.likesInfo.likesCount).toBe(1);
    expect(comment?.likesInfo.myStatus).toBe('Like');
  });

  it('should not increase the number of likes if the like has already been set', async () => {
    await request(app)
      .put(`/comments/${commentId}/like-status`)
      .auth(accessToken, { type: 'bearer' })
      .send({ likeStatus: 'Like' })
      .expect(HTTP_STATUS.NO_CONTENT_204);

    const response = await request(app).get(`/comments/${commentId}`).auth(accessToken, { type: 'bearer' });
    const comment = response.body;

    expect(comment?.likesInfo.likesCount).toBe(1);
    expect(comment?.likesInfo.myStatus).toBe('Like');
  });

  it('should change status from like to dislike', async () => {
    await request(app)
      .put(`/comments/${commentId}/like-status`)
      .auth(accessToken, { type: 'bearer' })
      .send({ likeStatus: 'Dislike' })
      .expect(HTTP_STATUS.NO_CONTENT_204);

    const response = await request(app).get(`/comments/${commentId}`).auth(accessToken, { type: 'bearer' });
    const comment = response.body;

    expect(comment?.likesInfo.likesCount).toBe(0);
    expect(comment?.likesInfo.dislikesCount).toBe(1);
    expect(comment?.likesInfo.myStatus).toBe('Dislike');
  });

  it('should increase the number of dislikes when another user dislikes', async () => {
    const userId = new ObjectId().toString();
    const payload = { userId };
    const secret = SETTINGS.JWT_PRIVATE_KEY!;
    const anotherAccessToken = jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: '15 m' });

    await request(app)
      .put(`/comments/${commentId}/like-status`)
      .auth(anotherAccessToken, { type: 'bearer' })
      .send({ likeStatus: 'Dislike' })
      .expect(HTTP_STATUS.NO_CONTENT_204);

    const response = await request(app)
      .get(`/comments/${commentId}`)
      .auth(anotherAccessToken, { type: 'bearer' });
    const comment = response.body;
    console.log(comment);

    expect(comment?.likesInfo.likesCount).toBe(0);
    expect(comment?.likesInfo.dislikesCount).toBe(2);
    expect(comment?.likesInfo.myStatus).toBe('Dislike');
  });

  it('should show status "None" to unauthorized user', async () => {
    const response = await request(app).get(`/comments/${commentId}`);
    const comment = response.body;
    expect(comment?.likesInfo.myStatus).toBe('None');
  });
});
