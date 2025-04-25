import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { dbName, mongoUri } from '../../../infrastructure/db/db.js';
import { SETTINGS } from '../../../settings.js';
import { ObjectId } from 'mongodb';
import { app } from '../../../app.js';
import { HTTP_STATUS } from '../../../common/types/http-status-codes.js';
import { JwtRefreshPayload } from '../../../security/auth/auth-types.js';
import { container } from '../../../ioc/container.js';
import { SessionsRepo } from '../../../security/sessions/sessions-repo.js';
import { SessionsQueryRepo } from '../../../security/sessions/sessions-query-repo.js';
import mongoose from 'mongoose';

const sessionsRepo = container.get(SessionsRepo);
const sessionsQueryRepo = container.get(SessionsQueryRepo);

beforeAll(async () => {
  await mongoose.connect(mongoUri, { dbName });
  await mongoose.connection.dropDatabase();
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('LOGOUT', () => {
  const userId = new ObjectId().toString();
  const deviceId = crypto.randomUUID();

  const payload = { userId };
  const secret = SETTINGS.JWT_PRIVATE_KEY!;
  const token = jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: '20 s' });
  const { iat, exp } = jwt.decode(token) as JwtRefreshPayload;

  it('should return 204 and delete session if a valid token is sent ', async () => {
    const deviceName = 'Nokia 1100';
    const ip = '192.168.0.1';
    await sessionsRepo.createSession(userId, deviceId, deviceName, ip, iat, exp);

    await request(app)
      .post('/auth/logout')
      .set('Cookie', `refreshToken=${token}`)
      .expect(HTTP_STATUS.NO_CONTENT_204);

    const session = await sessionsQueryRepo.isSessionActive(userId, deviceId, iat);
    expect(session).toBeNull;
  });
});
