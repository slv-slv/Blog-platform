import request from 'supertest';
import { mongoClient, mongoCluster } from '../../infrastructure/db/db.js';
import { SETTINGS } from '../../settings.js';
import { CONFIRMATION_STATUS, UserDBType } from '../../features/users/user-types.js';
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

describe('RESEND CONFIRMATION', () => {
  const newUser: UserDBType = {
    _id: new ObjectId(),
    login: 'NewUser',
    email: 'slvsl@vk.com',
    hash: 'somehash',
    createdAt: '2025-01-28T23:06:37.379Z',
    confirmation: {
      status: CONFIRMATION_STATUS.CONFIRMED,
      code: 'somecode',
      expiration: null,
    },
  };

  it('should not resend code for not existing user', async () => {
    const response = await request(app)
      .post('/auth/registration-email-resending')
      .send({ email: 'unknown@mail.io' })
      .expect(HTTP_STATUS.BAD_REQUEST_400);
  });

  it('should not resend code for confirmed user', async () => {
    await usersColl.insertOne(newUser);

    const response = await request(app)
      .post('/auth/registration-email-resending')
      .send({ email: newUser.email })
      .expect(HTTP_STATUS.BAD_REQUEST_400);
  });

  it('should resend code for not confirmed user', async () => {
    await usersColl.updateOne(
      { email: newUser.email },
      { $set: { 'confirmation.status': CONFIRMATION_STATUS.NOT_CONFIRMED } },
    );

    const response = await request(app)
      .post('/auth/registration-email-resending')
      .send({ email: newUser.email })
      .expect(HTTP_STATUS.NO_CONTENT_204);
  });
});
