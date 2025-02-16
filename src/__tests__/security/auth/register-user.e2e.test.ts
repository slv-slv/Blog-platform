import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import request from 'supertest';
import { dbName, mongoCluster } from '../../../infrastructure/db/db.js';
import { app } from '../../../app.js';
import { HTTP_STATUS } from '../../../common/types/http-status-codes.js';
import { CONFIRMATION_STATUS } from '../../../features/users/users-types.js';
import { usersCollection } from '../../../infrastructure/db/collections.js';

beforeAll(async () => {
  await mongoCluster.run();
  await mongoCluster.dropDb(dbName);
});

afterAll(async () => {
  await mongoCluster.stop();
  // await mongoMemoryServer.stop();
});

describe('REGISTER USER', () => {
  const newUser = {
    login: 'NewUser',
    password: 'NewPassword',
    email: 'slvsl@vk.com',
  };

  it('should register new user', async () => {
    await request(app).post('/auth/registration').send(newUser).expect(HTTP_STATUS.NO_CONTENT_204);

    const insertedUser = await usersCollection.findOne({ login: newUser.login });

    expect(insertedUser).toHaveProperty('_id');
    expect(insertedUser).toHaveProperty('login', newUser.login);
    expect(insertedUser).toHaveProperty('email', newUser.email);
    expect(insertedUser).toHaveProperty('hash');
    expect(insertedUser).toHaveProperty('createdAt');
    expect(new Date(insertedUser!.createdAt)).toBeInstanceOf(Date);
    expect(insertedUser).toHaveProperty('confirmation');
    expect(insertedUser!.confirmation.status).toBe(CONFIRMATION_STATUS.NOT_CONFIRMED);
    expect(insertedUser!.confirmation.code).not.toBeNull;
    expect(insertedUser!.confirmation.expiration).not.toBeNull;
    expect(insertedUser).toHaveProperty('passwordRecovery');
    expect(insertedUser!.passwordRecovery.code).toBeNull;
    expect(insertedUser!.passwordRecovery.expiration).toBeNull;
  });

  it('should not register already confirmed user', async () => {
    await usersCollection.updateOne(
      { login: newUser.login },
      { $set: { 'confirmation.status': CONFIRMATION_STATUS.CONFIRMED } },
    );

    await request(app).post('/auth/registration').send(newUser).expect(HTTP_STATUS.BAD_REQUEST_400);
  });
});
