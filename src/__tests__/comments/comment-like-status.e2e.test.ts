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
import { BlogsService } from '../../features/blogs/blogs-service.js';
import { PostsService } from '../../features/posts/posts-service.js';
import { CommentsQueryRepo } from '../../features/comments/comments-query-repo.js';

const blogsService = container.get(BlogsService);
const postsService = container.get(PostsService);
const usersService = container.get(UsersService);
const commentsService = container.get(CommentsService);
const commentsQueryRepo = container.get(CommentsQueryRepo);

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

  let userId: string;
  let accessToken: string;
  let commentId: string;

  it('should return 401 if no access token has been sent', async () => {
    const insertedUser = await usersService.createUser(login, email, password);
    userId = insertedUser.data!.id;

    const payload = { userId };
    const secret = SETTINGS.JWT_PRIVATE_KEY!;
    accessToken = jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: '15 m' });

    const blog = await blogsService.createBlog('blog name', 'blog description', 'https://www.example.com');
    const blogId = blog.id;

    const post = await postsService.createPost('post title', 'description', 'long boring text', blogId);
    const postId = post.data!.id;

    const comment = await commentsService.createComment(postId, 'long boring content', userId);
    commentId = comment.data!.id;

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

    const comment = await commentsQueryRepo.findComment(commentId, userId);

    expect(comment?.likesInfo.likesCount).toBe(1);
    expect(comment?.likesInfo.myStatus).toBe('Like');
  });

  it('should not increase the number of likes if the like has already been set', async () => {
    await request(app)
      .put(`/comments/${commentId}/like-status`)
      .auth(accessToken, { type: 'bearer' })
      .send({ likeStatus: 'Like' })
      .expect(HTTP_STATUS.NO_CONTENT_204);

    const comment = await commentsQueryRepo.findComment(commentId, userId);

    expect(comment?.likesInfo.likesCount).toBe(1);
    expect(comment?.likesInfo.myStatus).toBe('Like');
  });

  it('should increase the number of likes when another user likes', async () => {
    const anotherUserId = new ObjectId().toString();
    const payload = { userId: anotherUserId };
    const secret = SETTINGS.JWT_PRIVATE_KEY!;
    const anotherAccessToken = jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: '15 m' });

    await request(app)
      .put(`/comments/${commentId}/like-status`)
      .auth(anotherAccessToken, { type: 'bearer' })
      .send({ likeStatus: 'Like' })
      .expect(HTTP_STATUS.NO_CONTENT_204);

    const comment = await commentsQueryRepo.findComment(commentId, anotherUserId);

    expect(comment?.likesInfo.likesCount).toBe(2);
    expect(comment?.likesInfo.dislikesCount).toBe(0);
    expect(comment?.likesInfo.myStatus).toBe('Like');
  });

  it('should change status from like to dislike', async () => {
    await request(app)
      .put(`/comments/${commentId}/like-status`)
      .auth(accessToken, { type: 'bearer' })
      .send({ likeStatus: 'Dislike' })
      .expect(HTTP_STATUS.NO_CONTENT_204);

    const comment = await commentsQueryRepo.findComment(commentId, userId);

    expect(comment?.likesInfo.likesCount).toBe(1);
    expect(comment?.likesInfo.dislikesCount).toBe(1);
    expect(comment?.likesInfo.myStatus).toBe('Dislike');
  });

  it('should show status "None" to unauthorized user', async () => {
    const response = await request(app).get(`/comments/${commentId}`);
    const comment = response.body;
    expect(comment?.likesInfo.myStatus).toBe('None');
  });
});
