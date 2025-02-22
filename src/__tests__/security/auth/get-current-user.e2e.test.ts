import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { dbName, mongoUri } from '../../../infrastructure/db/db.js';
import { SETTINGS } from '../../../settings.js';
import { ObjectId } from 'mongodb';
import { app } from '../../../app.js';
import { HTTP_STATUS } from '../../../common/types/http-status-codes.js';
import { container } from '../../../ioc/container.js';
import { UsersService } from '../../../features/users/users-service.js';
import mongoose from 'mongoose';

const usersService = container.get(UsersService);

beforeAll(async () => {
  await mongoose.connect(mongoUri, { dbName });
  await mongoose.connection.dropDatabase();
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('GET CURRENT USER', () => {
  const login = 'NewUser';
  const email = 'example@gmail.com';
  const password = 'somepassword';

  const secret = SETTINGS.JWT_PRIVATE_KEY!;
  let token: string;
  let payload: { userId: string };
  let userId: string;

  it('should return 401 status code if no token sent', async () => {
    const user = await usersService.createUser(login, email, password);
    userId = user.data!.id;

    payload = { userId };

    await request(app).get('/auth/me').expect(HTTP_STATUS.UNAUTHORIZED_401);
  });

  it('should return 401 status code for not existing user', async () => {
    const payload = { userId: new ObjectId().toString() };
    const secret = SETTINGS.JWT_PRIVATE_KEY!;
    const token = jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: '15 m' });

    await request(app).get('/auth/me').auth(token, { type: 'bearer' }).expect(HTTP_STATUS.UNAUTHORIZED_401);
  });

  it('should return existing user if valid token sent', async () => {
    token = jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: '15 m' });
    const response = await request(app)
      .get('/auth/me')
      .auth(token, { type: 'bearer' })
      .expect(HTTP_STATUS.OK_200);

    expect(response.body).toEqual({
      email,
      login,
      userId,
    });
  });
});
