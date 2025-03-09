import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import { dbName, mongoUri } from '../../infrastructure/db/db.js';
import { SETTINGS } from '../../settings.js';
import { app } from '../../app.js';
import { HTTP_STATUS } from '../../common/types/http-status-codes.js';
import { container } from '../../ioc/container.js';
import { UsersService } from '../../features/users/users-service.js';
import { BlogsService } from '../../features/blogs/blogs-service.js';
import { PostsService } from '../../features/posts/posts-service.js';
import { PostsQueryRepo } from '../../features/posts/posts-query-repo.js';

const blogsService = container.get(BlogsService);
const postsService = container.get(PostsService);
const usersService = container.get(UsersService);
const postsQueryRepo = container.get(PostsQueryRepo);

beforeAll(async () => {
  await mongoose.connect(mongoUri, { dbName });
  await mongoose.connection.dropDatabase();
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('POST LIKE STATUS', () => {
  const login = 'NewUser';
  const email = 'example@gmail.com';
  const password = 'somepassword';

  let userId: string;
  let accessToken: string;
  let postId: string;

  it('should return 401 if no access token has been sent', async () => {
    const user = await usersService.createUser(login, email, password);
    userId = user.data!.id;

    const payload = { userId };
    const secret = SETTINGS.JWT_PRIVATE_KEY!;
    accessToken = jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: '15 m' });

    const blog = await blogsService.createBlog('blog name', 'blog description', 'https://www.example.com');
    const blogId = blog.id;

    const post = await postsService.createPost('post title', 'description', 'long boring text', blogId);
    postId = post.data!.id;

    await request(app)
      .put(`/posts/${postId}/like-status`)
      .send({ likeStatus: 'Like' })
      .expect(HTTP_STATUS.UNAUTHORIZED_401);
  });

  it('should return 404 if the post is not found', async () => {
    const notExistingId = new ObjectId().toString();
    await request(app)
      .put(`/posts/${notExistingId}/like-status`)
      .auth(accessToken, { type: 'bearer' })
      .send({ likeStatus: 'Like' })
      .expect(HTTP_STATUS.NOT_FOUND_404);
  });

  it('should return 400 if body has incorrect values', async () => {
    await request(app)
      .put(`/posts/${postId}/like-status`)
      .auth(accessToken, { type: 'bearer' })
      .send({ likeStatus: 'SuperLike' })
      .expect(HTTP_STATUS.BAD_REQUEST_400);
  });

  it('should return 204 and change like status', async () => {
    await request(app)
      .put(`/posts/${postId}/like-status`)
      .auth(accessToken, { type: 'bearer' })
      .send({ likeStatus: 'Like' })
      .expect(HTTP_STATUS.NO_CONTENT_204);

    const post = await postsQueryRepo.findPost(postId, userId);

    expect(post?.extendedLikesInfo.likesCount).toBe(1);
    expect(post?.extendedLikesInfo.myStatus).toBe('Like');
  });

  it('should not increase the number of likes if the like has already been set', async () => {
    await request(app)
      .put(`/posts/${postId}/like-status`)
      .auth(accessToken, { type: 'bearer' })
      .send({ likeStatus: 'Like' })
      .expect(HTTP_STATUS.NO_CONTENT_204);

    const post = await postsQueryRepo.findPost(postId, userId);

    expect(post?.extendedLikesInfo.likesCount).toBe(1);
    expect(post?.extendedLikesInfo.myStatus).toBe('Like');
  });

  it('should increase the number of likes when another user likes', async () => {
    const anotherUserId = new ObjectId().toString();
    const payload = { userId: anotherUserId };
    const secret = SETTINGS.JWT_PRIVATE_KEY!;
    const anotherAccessToken = jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: '15 m' });

    await request(app)
      .put(`/posts/${postId}/like-status`)
      .auth(anotherAccessToken, { type: 'bearer' })
      .send({ likeStatus: 'Like' })
      .expect(HTTP_STATUS.NO_CONTENT_204);

    const post = await postsQueryRepo.findPost(postId, userId);

    expect(post?.extendedLikesInfo.likesCount).toBe(2);
    expect(post?.extendedLikesInfo.dislikesCount).toBe(0);
    expect(post?.extendedLikesInfo.myStatus).toBe('Like');
  });

  it('should display the last 3 likes if 4 likes are set.', async () => {
    const user3Id = new ObjectId().toString();
    const user4Id = new ObjectId().toString();

    let payload = { userId: user3Id };
    let secret = SETTINGS.JWT_PRIVATE_KEY!;
    const user3AccessToken = jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: '15 m' });

    payload = { userId: user4Id };
    secret = SETTINGS.JWT_PRIVATE_KEY!;
    const user4AccessToken = jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: '15 m' });

    await request(app)
      .put(`/posts/${postId}/like-status`)
      .auth(user3AccessToken, { type: 'bearer' })
      .send({ likeStatus: 'Like' })
      .expect(HTTP_STATUS.NO_CONTENT_204);

    await request(app)
      .put(`/posts/${postId}/like-status`)
      .auth(user4AccessToken, { type: 'bearer' })
      .send({ likeStatus: 'Like' })
      .expect(HTTP_STATUS.NO_CONTENT_204);

    const post = await postsQueryRepo.findPost(postId, userId);

    expect(post?.extendedLikesInfo.likesCount).toBe(4);
    expect(post?.extendedLikesInfo.dislikesCount).toBe(0);
    expect(post?.extendedLikesInfo.newestLikes.length).toBe(3);

    const addedAtArray = post?.extendedLikesInfo.newestLikes.map((like) => new Date(like.addedAt).getTime());
    expect(addedAtArray).toEqual(addedAtArray?.sort((a: number, b: number) => b - a));
  });

  it('should change status from like to dislike', async () => {
    await request(app)
      .put(`/posts/${postId}/like-status`)
      .auth(accessToken, { type: 'bearer' })
      .send({ likeStatus: 'Dislike' })
      .expect(HTTP_STATUS.NO_CONTENT_204);

    const post = await postsQueryRepo.findPost(postId, userId);

    expect(post?.extendedLikesInfo.likesCount).toBe(3);
    expect(post?.extendedLikesInfo.dislikesCount).toBe(1);
    expect(post?.extendedLikesInfo.myStatus).toBe('Dislike');
  });

  it('should show status "None" to unauthorized user', async () => {
    const response = await request(app).get(`/posts/${postId}`);
    const post = response.body;
    expect(post?.extendedLikesInfo.myStatus).toBe('None');
  });
});
