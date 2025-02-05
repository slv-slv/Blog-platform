import request from 'supertest';
import { dbName, initDbUrl, mongoCluster, mongoMemoryServer } from '../../infrastructure/db/db.js';
import { CONFIRMATION_STATUS, UserDbType } from '../../features/users/users-types.js';
import { ObjectId } from 'mongodb';
import { app } from '../../app.js';
import { HTTP_STATUS } from '../../common/types/http-status-codes.js';
import { usersColl } from '../../infrastructure/db/collections.js';

beforeAll(async () => {
  await initDbUrl();
  await mongoCluster.run();
  await mongoCluster.dropDb(dbName);
});

afterAll(async () => {
  await mongoCluster.stop();
  await mongoMemoryServer.stop();
});

describe('RESEND CONFIRMATION', () => {
  const newUser: UserDbType = {
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
    await request(app)
      .post('/auth/registration-email-resending')
      .send({ email: 'unknown@mail.io' })
      .expect(HTTP_STATUS.BAD_REQUEST_400);
  });

  it('should not resend code for confirmed user', async () => {
    await usersColl.insertOne(newUser);

    await request(app)
      .post('/auth/registration-email-resending')
      .send({ email: newUser.email })
      .expect(HTTP_STATUS.BAD_REQUEST_400);
  });

  it('should resend code for not confirmed user', async () => {
    await usersColl.updateOne(
      { email: newUser.email },
      { $set: { 'confirmation.status': CONFIRMATION_STATUS.NOT_CONFIRMED } },
    );

    await request(app)
      .post('/auth/registration-email-resending')
      .send({ email: newUser.email })
      .expect(HTTP_STATUS.NO_CONTENT_204);
  });
});
