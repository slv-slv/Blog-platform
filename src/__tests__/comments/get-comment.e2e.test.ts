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
import { UsersQueryRepo } from '../../features/users/users-query-repo.js';

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

describe('GET COMMENT', () => {
  const login = 'NewUser';
  const email = 'example@gmail.com';
  const password = 'somepassword';

  let accessToken: string;
  let commentId: string;

  it('should return 200 and return comment by id', async () => {
    const insertedUser = await usersService.createUser(login, email, password);
    const userId = insertedUser.id;

    const payload = { userId };
    const secret = SETTINGS.JWT_PRIVATE_KEY!;
    accessToken = jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: '15 m' });

    const postId = new ObjectId().toString();
    const content = 'very long boring content';
    const currentUser = await usersQueryRepo.getCurrentUser(userId);

    const comment = await commentsService.createComment(postId, content, currentUser!);
    commentId = comment.data.id;

    const response = await request(app).get(`/comments/${commentId}`).expect(HTTP_STATUS.OK_200);
    expect(Object.keys(response.body)).toHaveLength(5);
  });

  it('should return 404 if the comment is not found', async () => {
    const incorrectPostId = new ObjectId();
    await request(app).get(`/comments/${incorrectPostId}`).expect(HTTP_STATUS.NOT_FOUND_404);

    await commentsService.deleteComment(commentId);
    await request(app).get(`/comments/${commentId}`).expect(HTTP_STATUS.NOT_FOUND_404);
  });
});
