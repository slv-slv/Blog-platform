import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import setCookie from 'set-cookie-parser';
import { dbName, mongoCluster } from '../../../infrastructure/db/db.js';
import { SETTINGS } from '../../../settings.js';
import { CONFIRMATION_STATUS, UserDbType } from '../../../features/users/users-types.js';
import { ObjectId } from 'mongodb';
import { app } from '../../../app.js';
import { HTTP_STATUS } from '../../../common/types/http-status-codes.js';
import { sessionsColl, usersColl } from '../../../infrastructure/db/collections.js';
import { JwtAcessPayload, JwtRefreshPayload } from '../../../security/auth/auth-types.js';
import { sessionsQueryRepo } from '../../../instances/repositories.js';

beforeAll(async () => {
  await mongoCluster.run();
  await mongoCluster.dropDb(dbName);
});

afterAll(async () => {
  await mongoCluster.stop();
  // await mongoMemoryServer.stop();
});

describe('LOGIN', () => {
  const password = 'somepassword';
  const hash = bcrypt.hashSync(password, 10);

  const newUser: UserDbType = {
    _id: new ObjectId(),
    login: 'NewUser',
    email: 'example@gmail.com',
    hash: hash,
    createdAt: new Date().toISOString(),
    confirmation: {
      status: CONFIRMATION_STATUS.CONFIRMED,
      code: crypto.randomUUID(),
      expiration: null,
    },
  };

  it('should return 400 status code if login or password has incorrect value', async () => {
    await usersColl.insertOne(newUser);

    await request(app)
      .post('/auth/login')
      .send({ loginOrEmail: newUser.login, password: 12345 })
      .expect(HTTP_STATUS.BAD_REQUEST_400);

    await request(app)
      .post('/auth/login')
      .send({ loginOrEmail: newUser.email, password: ' ' })
      .expect(HTTP_STATUS.BAD_REQUEST_400);

    await request(app)
      .post('/auth/login')
      .send({ loginOrEmail: 12345, password })
      .expect(HTTP_STATUS.BAD_REQUEST_400);

    await request(app)
      .post('/auth/login')
      .send({ loginOrEmail: '  ', password })
      .expect(HTTP_STATUS.BAD_REQUEST_400);
  });

  it('should return 401 status code if credentials are wrong', async () => {
    await request(app)
      .post('/auth/login')
      .send({ loginOrEmail: newUser.login, password: 'somepassword1' })
      .expect(HTTP_STATUS.UNAUTHORIZED_401);

    await request(app)
      .post('/auth/login')
      .send({ loginOrEmail: 'newUser', password })
      .expect(HTTP_STATUS.UNAUTHORIZED_401);
  });

  it('should return 401 status code if user is not confirmed', async () => {
    await usersColl.updateOne(
      { _id: newUser._id },
      {
        $set: {
          'confirmation.status': CONFIRMATION_STATUS.NOT_CONFIRMED,
          'confirmation.expiration': new Date().toISOString(),
        },
      },
    );

    await request(app)
      .post('/auth/login')
      .send({ loginOrEmail: newUser.login, password })
      .expect(HTTP_STATUS.UNAUTHORIZED_401);
  });

  it('should return valid access token for confirmed user', async () => {
    await usersColl.updateOne(
      { _id: newUser._id },
      { $set: { 'confirmation.status': CONFIRMATION_STATUS.CONFIRMED, 'confirmation.expiration': null } },
    );

    const response = await request(app)
      .post('/auth/login')
      .send({ loginOrEmail: newUser.login, password })
      .expect(HTTP_STATUS.OK_200);

    const { accessToken } = response.body;
    expect(jwt.verify(accessToken, SETTINGS.JWT_PRIVATE_KEY!)).not.toThrow;
  });

  it('should return valid refresh token in cookie', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ loginOrEmail: newUser.login, password })
      .expect(HTTP_STATUS.OK_200);

    const setCookiesHeader = response.headers['set-cookie'];
    const cookies = setCookie.parse(setCookiesHeader, { map: true });
    expect(cookies).toBeDefined;

    const refreshToken = cookies.refreshToken.value;
    expect(jwt.verify(refreshToken, SETTINGS.JWT_PRIVATE_KEY!)).not.toThrow;

    const payload = jwt.verify(refreshToken, SETTINGS.JWT_PRIVATE_KEY!);
    const { userId, deviceId, iat } = payload as JwtRefreshPayload;
    expect(userId).toBe(newUser._id.toString());

    const session = await sessionsQueryRepo.checkSession(userId, deviceId, iat);
    expect(session).not.toBeNull;
  });
});
