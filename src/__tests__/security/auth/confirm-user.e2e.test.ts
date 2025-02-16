import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import request from 'supertest';
import { dbName, mongoCluster, mongoMemoryServer } from '../../../infrastructure/db/db.js';
import { app } from '../../../app.js';
import { CONFIRMATION_STATUS } from '../../../features/users/users-types.js';
import { HTTP_STATUS } from '../../../common/types/http-status-codes.js';
import { usersCollection } from '../../../infrastructure/db/collections.js';
import { container } from '../../../ioc/container.js';
import { UsersRepo } from '../../../features/users/users-repo.js';

const usersRepo = container.get(UsersRepo);

beforeAll(async () => {
  await mongoCluster.run();
  await mongoCluster.dropDb(dbName);
});

afterAll(async () => {
  await mongoCluster.stop();
  // await mongoMemoryServer.stop();
});

describe('CONFIRM USER', () => {
  const pastDate = new Date();
  pastDate.setHours(pastDate.getHours() - 1);

  const futureDate = new Date();
  futureDate.setHours(futureDate.getHours() + 1);

  const login = 'NewUser';
  const email = 'some.email@gmail.com';
  const hash = 'somehash';
  const createdAt = new Date().toISOString();
  const confirmation = {
    status: CONFIRMATION_STATUS.NOT_CONFIRMED,
    code: '0d56a34c-9eaf-473f-842c-309ab6c2c9df',
    expiration: pastDate.toISOString(),
  };
  const passwordRecovery = {
    code: null,
    expiration: null,
  };

  it('should not confirm not existing user', async () => {
    await request(app)
      .post('/auth/registration-confirmation')
      .send({ code: confirmation.code })
      .expect(HTTP_STATUS.BAD_REQUEST_400);
  });

  it('should not confirm user with expired code', async () => {
    await usersRepo.createUser(login, email, hash, createdAt, confirmation, passwordRecovery);

    await request(app)
      .post('/auth/registration-confirmation')
      .send({ code: confirmation.code })
      .expect(HTTP_STATUS.BAD_REQUEST_400);
  });

  it('should confirm user with valid code', async () => {
    await usersCollection.updateOne(
      { login },
      { $set: { 'confirmation.expiration': futureDate.toISOString() } },
    );

    await request(app)
      .post('/auth/registration-confirmation')
      .send({ code: confirmation.code })
      .expect(HTTP_STATUS.NO_CONTENT_204);

    const confirmedUser = await usersCollection.findOne({ email });

    expect(confirmedUser!.confirmation.status).toBe(CONFIRMATION_STATUS.CONFIRMED);
    expect(confirmedUser!.confirmation.expiration).toBeNull;
  });

  it('should not confirm already confirmed user', async () => {
    await request(app)
      .post('/auth/registration-confirmation')
      .send({ code: confirmation.code })
      .expect(HTTP_STATUS.BAD_REQUEST_400);
  });
});
