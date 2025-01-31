import request from 'supertest';
import jwt from 'jsonwebtoken';
import { mongoClient, mongoCluster } from '../../infrastructure/db/db.js';
import { SETTINGS } from '../../settings.js';
import { CONFIRMATION_STATUS, UserDBType } from '../../features/users/users-types.js';
import { ObjectId } from 'mongodb';
import { app } from '../../app.js';
import { HTTP_STATUS } from '../../common/types/http-status-codes.js';
import { usersColl } from '../../features/users/users-repo.js';
import { response } from 'express';

beforeAll(async () => {
  await mongoClient.connect();
  await mongoCluster.dropDb(SETTINGS.DB_NAME);
});

afterAll(async () => {
  await mongoClient.close();
});

describe('GET CURRENT USER', () => {
  const newUser: UserDBType = {
    _id: new ObjectId(),
    login: 'NewUser',
    email: 'example@gmail.com',
    hash: 'etrdfghcvbn',
    createdAt: new Date().toISOString(),
    confirmation: {
      status: CONFIRMATION_STATUS.CONFIRMED,
      code: crypto.randomUUID(),
      expiration: null,
    },
  };

  const payload = { userId: newUser._id.toString() };
  const secret = SETTINGS.JWT_PRIVATE_KEY!;
  const token = jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: '15 m' });

  it('should return unauthorized 401 if no token sent', async () => {
    const response = await request(app).get('/auth/me').expect(HTTP_STATUS.UNAUTHORIZED_401);
  });

  it('should return unauthorized 401 for not existing user', async () => {
    const response = await request(app)
      .get('/auth/me')
      .auth(token, { type: 'bearer' })
      .expect(HTTP_STATUS.UNAUTHORIZED_401);
  });

  it('should return unauthorized 401 if invalid token sent', async () => {
    await usersColl.insertOne(newUser);
    const fakeToken = jwt.sign(payload, 'somefakesecretkey', { algorithm: 'HS256', expiresIn: '15 m' });

    const response = await request(app)
      .get('/auth/me')
      .auth(fakeToken, { type: 'bearer' })
      .expect(HTTP_STATUS.UNAUTHORIZED_401);
  });

  it('should return existing user if valid token sent', async () => {
    const response = await request(app)
      .get('/auth/me')
      .auth(token, { type: 'bearer' })
      .expect(HTTP_STATUS.OK_200);

    expect(response.body).toEqual({
      email: newUser.email,
      login: newUser.login,
      userId: newUser._id.toString(),
    });
  });
});
