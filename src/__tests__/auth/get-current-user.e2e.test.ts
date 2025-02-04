import request from 'supertest';
import jwt from 'jsonwebtoken';
import { dbName, mongoCluster } from '../../infrastructure/db/db.js';
import { SETTINGS } from '../../settings.js';
import { CONFIRMATION_STATUS, UserDbType } from '../../features/users/users-types.js';
import { ObjectId } from 'mongodb';
import { app } from '../../app.js';
import { HTTP_STATUS } from '../../common/types/http-status-codes.js';
import { usersColl } from '../../infrastructure/db/collections.js';

beforeAll(async () => {
  await mongoCluster.run();
  await mongoCluster.dropDb(dbName);
});

afterAll(async () => {
  await mongoCluster.stop();
});

describe('GET CURRENT USER', () => {
  const newUser: UserDbType = {
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

  it('should return 401 status code if no token sent', async () => {
    await request(app).get('/auth/me').expect(HTTP_STATUS.UNAUTHORIZED_401);
  });

  it('should return 401 status code for not existing user', async () => {
    await request(app).get('/auth/me').auth(token, { type: 'bearer' }).expect(HTTP_STATUS.UNAUTHORIZED_401);
  });

  it('should return 401 status code if invalid token sent', async () => {
    await usersColl.insertOne(newUser);
    const fakeToken = jwt.sign(payload, 'somefakesecretkey', { algorithm: 'HS256', expiresIn: '15 m' });

    await request(app)
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
