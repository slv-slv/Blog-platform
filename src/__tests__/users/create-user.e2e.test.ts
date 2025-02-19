import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../../app.js';
import { HTTP_STATUS } from '../../common/types/http-status-codes.js';
import { dbName, mongoUri } from '../../infrastructure/db/db.js';
import mongoose from 'mongoose';

describe('CREATE USER', () => {
  beforeAll(async () => {
    await mongoose.connect(mongoUri, { dbName });
    await mongoose.connection.dropDatabase();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  const newUser = {
    login: 'NewUser',
    password: 'qwerty123',
    email: 'example@example.com',
  };

  it('admin should create a new user and return user object', async () => {
    const response = await request(app)
      .post('/users')
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(newUser)
      .expect(HTTP_STATUS.CREATED_201);

    expect(Object.keys(response.body)).toHaveLength(4);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('login', newUser.login);
    expect(response.body).toHaveProperty('email', newUser.email);
    expect(response.body).toHaveProperty('createdAt');
    expect(new Date(response.body.createdAt)).toBeInstanceOf(Date);
  });
});
