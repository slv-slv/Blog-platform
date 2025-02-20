import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import request from 'supertest';
import { dbName, mongoUri } from '../../../infrastructure/db/db.js';
import { app } from '../../../app.js';
import { HTTP_STATUS } from '../../../common/types/http-status-codes.js';
import { CONFIRMATION_STATUS } from '../../../features/users/users-types.js';
import mongoose from 'mongoose';
import { UserModel } from '../../../features/users/users-model.js';

beforeAll(async () => {
  await mongoose.connect(mongoUri, { dbName });
  await mongoose.connection.dropDatabase();
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('REGISTER USER', () => {
  const newUser = {
    login: 'NewUser',
    password: 'NewPassword',
    email: 'slvsl@vk.com',
  };

  it('should register new user', async () => {
    await request(app).post('/auth/registration').send(newUser).expect(HTTP_STATUS.NO_CONTENT_204);

    const insertedUser = await UserModel.findOne({ login: newUser.login }).lean();

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
    await UserModel.updateOne(
      { login: newUser.login },
      { $set: { 'confirmation.status': CONFIRMATION_STATUS.CONFIRMED } },
    );

    await request(app).post('/auth/registration').send(newUser).expect(HTTP_STATUS.BAD_REQUEST_400);
  });
});
