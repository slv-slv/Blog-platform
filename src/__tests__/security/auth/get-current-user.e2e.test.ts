import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { dbName, mongoCluster } from '../../../infrastructure/db/db.js';
import { SETTINGS } from '../../../settings.js';
import { CONFIRMATION_STATUS, UserDbType } from '../../../features/users/users-types.js';
import { ObjectId } from 'mongodb';
import { app } from '../../../app.js';
import { HTTP_STATUS } from '../../../common/types/http-status-codes.js';
import { usersColl } from '../../../infrastructure/db/collections.js';
import { usersService } from '../../../instances/services.js';

beforeAll(async () => {
  await mongoCluster.run();
  await mongoCluster.dropDb(dbName);
});

afterAll(async () => {
  await mongoCluster.stop();
  // await mongoMemoryServer.stop();
});

describe('GET CURRENT USER', () => {
  const login = 'NewUser';
  const email = 'example@gmail.com';
  const password = 'somepassword';

  const secret = SETTINGS.JWT_PRIVATE_KEY!;
  let token: string;
  let payload: { userId: string };
  let userId: string;

  it('should return 401 status code if no token sent', async () => {
    const user = await usersService.createUser(login, email, password);
    userId = user.id;

    payload = { userId };

    await request(app).get('/auth/me').expect(HTTP_STATUS.UNAUTHORIZED_401);
  });

  it('should return 401 status code for not existing user', async () => {
    const payload = { userId: new ObjectId().toString() };
    const secret = SETTINGS.JWT_PRIVATE_KEY!;
    const token = jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: '15 m' });

    await request(app).get('/auth/me').auth(token, { type: 'bearer' }).expect(HTTP_STATUS.UNAUTHORIZED_401);
  });

  it('should return existing user if valid token sent', async () => {
    token = jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: '15 m' });
    const response = await request(app)
      .get('/auth/me')
      .auth(token, { type: 'bearer' })
      .expect(HTTP_STATUS.OK_200);

    expect(response.body).toEqual({
      email,
      login,
      userId,
    });
  });
});
