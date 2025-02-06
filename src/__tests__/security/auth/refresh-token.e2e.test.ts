import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { dbName, mongoCluster } from '../../../infrastructure/db/db.js';
import { SETTINGS } from '../../../settings.js';
import { ObjectId } from 'mongodb';
import { app } from '../../../app.js';
import { HTTP_STATUS } from '../../../common/types/http-status-codes.js';
import { JwtAcessPayload, JwtRefreshPayload } from '../../../security/auth/auth-types.js';
import { sessionsRepo } from '../../../instances/repositories.js';

beforeAll(async () => {
  await mongoCluster.run();
  await mongoCluster.dropDb(dbName);
});

afterAll(async () => {
  await mongoCluster.stop();
  // await mongoMemoryServer.stop();
});

describe('REFRESH-TOKEN', () => {
  const userId = new ObjectId().toString();

  const payload = { userId, deviceId: crypto.randomUUID() };
  const secret = SETTINGS.JWT_PRIVATE_KEY!;
  const token = jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: '20 s' });

  it('should return 401 status code if no token sent', async () => {
    await request(app).post('/auth/refresh-token').expect(HTTP_STATUS.UNAUTHORIZED_401);
  });

  it('should return 401 status code for not existing session', async () => {
    await request(app)
      .post('/auth/refresh-token')
      .set('Cookie', `refreshToken=${token}`)
      .expect(HTTP_STATUS.UNAUTHORIZED_401);
  });

  it('should return 401 status code if an invalid token is sent', async () => {
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
    const response = await request(app)
      .post('/auth/refresh-token')
      .set('Cookie', `refreshToken=${token}`)
      .expect(HTTP_STATUS.OK_200);

    const { accessToken } = response.body;
    expect(jwt.verify(accessToken, SETTINGS.JWT_PRIVATE_KEY!)).not.toThrow;
    const acessJwtPayload = jwt.verify(accessToken, SETTINGS.JWT_PRIVATE_KEY!) as JwtAcessPayload;
    expect(acessJwtPayload.userId).toEqual(userId);

    // console.log(response.headers);
    const cookies = response.headers['set-cookie'];
    expect(cookies).toBeDefined;

    const cookiesArray = Array.isArray(cookies) ? cookies : [cookies];

    const tokenCookie = cookiesArray.find((cookie: string) => cookie.startsWith('refreshToken='));
    expect(tokenCookie).toBeDefined;

    const refreshToken = tokenCookie.split('; ')[0].split('=')[1];
    expect(jwt.verify(refreshToken, SETTINGS.JWT_PRIVATE_KEY!)).not.toThrow;

    const refreshJwtPayload = jwt.verify(refreshToken, SETTINGS.JWT_PRIVATE_KEY!) as JwtAcessPayload;
    // console.log(refreshJwtPayload);
    expect(refreshJwtPayload.userId).toEqual(userId);
  });

  it('it should return 401 status code if the user sends the same token a second time', async () => {
    await request(app)
      .post('/auth/refresh-token')
      .set('Cookie', `refreshToken=${token}`)
      .expect(HTTP_STATUS.UNAUTHORIZED_401);
  });
});
