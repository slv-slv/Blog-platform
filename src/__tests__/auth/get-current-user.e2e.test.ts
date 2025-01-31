import request from 'supertest';
import jwt from 'jsonwebtoken';
import { mongoClient, mongoCluster } from '../../infrastructure/db/db.js';
import { SETTINGS } from '../../settings.js';
import { CONFIRMATION_STATUS, UserDBType } from '../../features/users/users-types.js';
import { ObjectId } from 'mongodb';
import { app } from '../../app.js';
import { HTTP_STATUS } from '../../common/types/http-status-codes.js';
import { usersColl } from '../../features/users/users-repo.js';

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

  it('should not resend code for not existing user', async () => {
    const response = await request(app)
      .post('/auth/registration-email-resending')
      .send({ email: 'unknown@mail.io' })
      .expect(HTTP_STATUS.BAD_REQUEST_400);
  });
});
