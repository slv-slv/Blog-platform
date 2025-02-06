import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { dbName, mongoCluster } from '../../../infrastructure/db/db.js';
import { SETTINGS } from '../../../settings.js';
import { ObjectId } from 'mongodb';
import { app } from '../../../app.js';
import { HTTP_STATUS } from '../../../common/types/http-status-codes.js';
import { sessionsColl } from '../../../infrastructure/db/collections.js';
import { JwtRefreshPayload } from '../../../security/auth/auth-types.js';
import { sessionsRepo } from '../../../instances/repositories.js';

beforeAll(async () => {
  await mongoCluster.run();
  await mongoCluster.dropDb(dbName);
});

afterAll(async () => {
  await mongoCluster.stop();
  // await mongoMemoryServer.stop();
});

describe('LOGOUT', () => {
  const userId = new ObjectId().toString();

  const payload = { userId };
  const secret = SETTINGS.JWT_PRIVATE_KEY!;
  const token = jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: '20 s' });
  const { deviceId, iat, exp } = jwt.decode(token) as JwtRefreshPayload;

  it('should return 204 and delete session if a valid token is sent ', async () => {
    const deviceName = 'Nokia 1100';
    const ip = '192.168.0.1';
    await sessionsRepo.createSession(userId, deviceId, deviceName, ip, iat, exp);

    expect(
      await sessionsColl.countDocuments({ userId, devices: { $elemMatch: { id: deviceId, iat } } }),
    ).toEqual(1);

    await request(app)
      .post('/auth/logout')
      .set('Cookie', `refreshToken=${token}`)
      .expect(HTTP_STATUS.NO_CONTENT_204);

    expect(
      await sessionsColl.countDocuments({ userId, devices: { $elemMatch: { id: deviceId, iat } } }),
    ).toEqual(0);
  });
});
