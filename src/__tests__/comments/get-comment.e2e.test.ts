import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { dbName, mongoCluster } from '../../infrastructure/db/db.js';
import { ObjectId } from 'mongodb';
import { SETTINGS } from '../../settings.js';
import { app } from '../../app.js';
import { HTTP_STATUS } from '../../common/types/http-status-codes.js';
import { container } from '../../ioc/container.js';
import { BlogsRepo } from '../../features/blogs/blogs-repo.js';
import { PostsRepo } from '../../features/posts/posts-repo.js';
import { CommentsRepo } from '../../features/comments/comments-repo.js';
import { UsersService } from '../../features/users/users-service.js';

const blogsRepo = container.get(BlogsRepo);
const postsRepo = container.get(PostsRepo);
const commentsRepo = container.get(CommentsRepo);
const usersService = container.get(UsersService);

beforeAll(async () => {
  await mongoCluster.run();
  await mongoCluster.dropDb(dbName);
});

afterAll(async () => {
  await mongoCluster.stop();
  // await mongoMemoryServer.stop();
});

describe('CREATE COMMENT', () => {
  const login = 'NewUser';
  const email = 'example@gmail.com';
  const password = 'somepassword';
  const createdAt = new Date().toISOString();

  let postId: string;
  let accessToken: string;
  let commentId: string;

  it('should return 200 and return comment by id', async () => {
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

    let response = await request(app)
      .post(`/posts/${postId}/comments`)
      .auth(accessToken, { type: 'bearer' })
      .send({ content: 'very long boring content' })
      .expect(HTTP_STATUS.CREATED_201);

    commentId = response.body.id;

    response = await request(app).get(`/comments/${commentId}`).expect(HTTP_STATUS.OK_200);
    expect(Object.keys(response.body)).toHaveLength(4);
  });

  it('should return 404 if the comment is not found', async () => {
    const incorrectPostId = new ObjectId();
    await request(app).get(`/comments/${incorrectPostId}`).expect(HTTP_STATUS.NOT_FOUND_404);

    await commentsRepo.deleteComment(commentId);
    await request(app).get(`/comments/${commentId}`).expect(HTTP_STATUS.NOT_FOUND_404);
  });
});
