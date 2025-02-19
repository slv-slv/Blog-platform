import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import setCookie from 'set-cookie-parser';
import { dbName, mongoUri } from '../../../infrastructure/db/db.js';
import { SETTINGS } from '../../../settings.js';
import { ObjectId } from 'mongodb';
import { app } from '../../../app.js';
import { HTTP_STATUS } from '../../../common/types/http-status-codes.js';
import { JwtRefreshPayload } from '../../../security/auth/auth-types.js';
import { container } from '../../../ioc/container.js';
import { SessionsRepo } from '../../../security/sessions/sessions-repo.js';
import mongoose from 'mongoose';

const sessionsRepo = container.get(SessionsRepo);

beforeAll(async () => {
  await mongoose.connect(mongoUri, { dbName });
  await mongoose.connection.dropDatabase();
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('REFRESH-TOKEN', () => {
  const userId = new ObjectId().toString();

  const payload = { userId, deviceId: crypto.randomUUID() };
  const secret = SETTINGS.JWT_PRIVATE_KEY!;
  const token = jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: '20 s' });

  it('should return 401 if no token sent', async () => {
    await request(app).post('/auth/refresh-token').expect(HTTP_STATUS.UNAUTHORIZED_401);
  });

  it('should return 401 for not existing session', async () => {
    await request(app)
      .post('/auth/refresh-token')
      .set('Cookie', `refreshToken=${token}`)
      .expect(HTTP_STATUS.UNAUTHORIZED_401);
  });

  it('should return 401 if an invalid token is sent', async () => {
    const { deviceId, iat, exp } = jwt.decode(token) as JwtRefreshPayload;

    const deviceName = 'Nokia 1100';
    const ip = '192.168.0.1';
    await sessionsRepo.createSession(userId, deviceId, deviceName, ip, iat, exp);

    const fakeToken = jwt.sign(payload, 'somefakesecretkey', { algorithm: 'HS256', expiresIn: '15 m' });

    await request(app)
      .post('/auth/refresh-token')
      .set('Cookie', `refreshToken=${fakeToken}`)
      .expect(HTTP_STATUS.UNAUTHORIZED_401);
  });

  it('should return new pair of tokens and create new session', async () => {
    // Задержка, чтобы версия выданного токена отличалась от предыдущего токена пользователя
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const response = await request(app)
      .post('/auth/refresh-token')
      .set('Cookie', `refreshToken=${token}`)
      .expect(HTTP_STATUS.OK_200);

    const { accessToken } = response.body;
    expect(jwt.verify(accessToken, SETTINGS.JWT_PRIVATE_KEY!)).not.toThrow;

    // console.log(response.headers);
    const setCookiesHeader = response.headers['set-cookie'];
    const cookies = setCookie.parse(setCookiesHeader, { map: true });
    expect(cookies).toBeDefined;

    const refreshToken = cookies.refreshToken.value;
    expect(jwt.verify(refreshToken, SETTINGS.JWT_PRIVATE_KEY!)).not.toThrow;
  });

  it('should return 401 if the user sends the same token a second time', async () => {
    await request(app)
      .post('/auth/refresh-token')
      .set('Cookie', `refreshToken=${token}`)
      .expect(HTTP_STATUS.UNAUTHORIZED_401);
  });
});
