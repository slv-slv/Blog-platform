import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../../app.js';
import { HTTP_STATUS } from '../../common/types/http-status-codes.js';
import { dbName, mongoUri } from '../../infrastructure/db/db.js';
import { container } from '../../ioc/container.js';
import { UsersService } from '../../features/users/users-service.js';
import mongoose from 'mongoose';

const usersService = container.get(UsersService);

describe('GET ALL USERS', () => {
  beforeAll(async () => {
    await mongoose.connect(mongoUri, { dbName });
    await mongoose.connection.dropDatabase();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should return an array of users', async () => {
    for (let i = 0; i < 10; i += 1) {
      const login = `NewUser${i}`;
      const password = `somepassword${i}`;
      const email = `example${i}@gmail.com`;

      await usersService.createUser(login, email, password);
    }

    const response = await request(app)
      .get('/users')
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .expect(HTTP_STATUS.OK_200);

    expect(Object.keys(response.body)).toHaveLength(5);

    expect(response.body).toHaveProperty('pagesCount');
    expect(response.body).toHaveProperty('page');
    expect(response.body).toHaveProperty('pageSize');
    expect(response.body).toHaveProperty('totalCount');
    expect(response.body).toHaveProperty('items');

    expect(response.body.items).toHaveLength(10);
  });

  it('should return 401 if credentials are incorrect', async () => {
    await request(app).get('/users').expect(HTTP_STATUS.UNAUTHORIZED_401);
  });
});
