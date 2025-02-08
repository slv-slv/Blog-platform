import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../../app.js';
import { HTTP_STATUS } from '../../common/types/http-status-codes.js';
import { dbName, mongoCluster } from '../../infrastructure/db/db.js';
import { usersRepo } from '../../instances/repositories.js';

describe('GET ALL USERS', () => {
  beforeAll(async () => {
    await mongoCluster.run();
    await mongoCluster.dropDb(dbName);
  });

  afterAll(async () => {
    await mongoCluster.stop();
    // await mongoMemoryServer.stop();
  });

  it('should return an array of users', async () => {
    for (let i = 0; i < 10; i += 1) {
      const login = `NewUser${i}`;
      const hash = `somehash${i}`;
      const email = `example${i}@gmail.com`;
      const createdAt = new Date().toISOString();

      await usersRepo.createUser(login, email, hash, createdAt);
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
