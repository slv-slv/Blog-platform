import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import request from 'supertest';
import { dbName, mongoUri } from '../../../infrastructure/db/db.js';
import { app } from '../../../app.js';
import { HTTP_STATUS } from '../../../common/types/http-status-codes.js';
import { CONFIRMATION_STATUS } from '../../../features/users/users-types.js';
import { UsersRepo } from '../../../features/users/users-repo.js';
import { container } from '../../../ioc/container.js';
import mongoose from 'mongoose';
import { UserModel } from '../../../features/users/users-model.js';

const usersRepo = container.get(UsersRepo);

beforeAll(async () => {
  await mongoose.connect(mongoUri, { dbName });
  await mongoose.connection.dropDatabase();
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('PASSWORD RECOVERY', () => {
  const recoveryCode = crypto.randomUUID();

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
    code: null,
    expiration: null,
  };
  const passwordRecovery = {
    code: recoveryCode,
    expiration: futureDate.toISOString(),
  };

  it('should return 204 if correct recovery code is sent', async () => {
    await usersRepo.createUser(login, email, hash, createdAt, confirmation, passwordRecovery);

    const body = {
      newPassword: 'newpassword',
      recoveryCode,
    };

    await request(app).post('/auth/new-password').send(body).expect(HTTP_STATUS.NO_CONTENT_204);
  });

  it('should return 400 if password has incorrect value', async () => {
    const body = {
      newPassword: 'pass',
      recoveryCode,
    };

    await request(app).post('/auth/new-password').send(body).expect(HTTP_STATUS.BAD_REQUEST_400);
  });

  it('should return 400 if recovery code is incorrect', async () => {
    const incorrectCode = crypto.randomUUID();

    const body = {
      newPassword: 'newpassword',
      recoveryCode: incorrectCode,
    };

    await request(app).post('/auth/new-password').send(body).expect(HTTP_STATUS.BAD_REQUEST_400);
  });

  it('should return 400 if recovery code is expired', async () => {
    await UserModel.updateOne({ login }, { $set: { 'passwordRecovery.expiration': pastDate.toISOString() } });

    const body = {
      newPassword: 'newpassword',
      recoveryCode,
    };

    await request(app).post('/auth/new-password').send(body).expect(HTTP_STATUS.BAD_REQUEST_400);
  });
});
