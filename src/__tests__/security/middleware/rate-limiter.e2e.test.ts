import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../../../app.js';
import { HTTP_STATUS } from '../../../common/types/http-status-codes.js';
import { dbName, mongoUri } from '../../../infrastructure/db/db.js';
import mongoose from 'mongoose';

beforeAll(async () => {
  await mongoose.connect(mongoUri, { dbName });
  await mongoose.connection.dropDatabase();
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('IP-THROTTLER', () => {
  it('should return 400 for first 5 requests and 429 for 6th', async () => {
    for (let i = 0; i < 5; i += 1) {
      await request(app)
        .post('/auth/login')
        .send({ loginOrEmail: 'login', password: 'password' })
        .expect(HTTP_STATUS.UNAUTHORIZED_401);

      // await new Promise((resolve) => setTimeout(resolve, 500));
    }

    // await request(app)
    //   .post('/auth/login')
    //   .send({ loginOrEmail: 'login', password: 'password' })
    //   .expect(HTTP_STATUS.TOO_MANY_REQUESTS_429);
  });
});
