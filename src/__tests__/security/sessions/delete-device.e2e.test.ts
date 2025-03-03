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
import mongoose from 'mongoose';

const sessionsRepo = container.get(SessionsRepo);

beforeAll(async () => {
  await mongoose.connect(mongoUri, { dbName });
  await mongoose.connection.dropDatabase();
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('GET-ACTIVE-DEVICES', () => {
  const userId = new ObjectId().toString();
  const deviceId = crypto.randomUUID();

  const payload = { userId, deviceId };
  const secret = SETTINGS.JWT_PRIVATE_KEY!;
  const token = jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: '20 s' });
  const { iat, exp } = jwt.decode(token) as JwtRefreshPayload;

  const anotherUserId = new ObjectId().toString();
  const anotherDeviceId = crypto.randomUUID();

  it('should return 401 if refresh token with inactive device is sent', async () => {
    await sessionsRepo.createSession(
      anotherUserId,
      anotherDeviceId,
      'Another user device',
      '999.888.7.6',
      iat,
      exp,
    );

    await request(app)
      .delete(`/security/devices/${anotherDeviceId}`)
      .set('Cookie', `refreshToken=${token}`)
      .expect(HTTP_STATUS.UNAUTHORIZED_401);
  });

  it('should return 403 if user tries to delete device of another user', async () => {
    await sessionsRepo.createSession(userId, deviceId, 'Siemens SX1', '192.168.0.1', iat, exp);

    await request(app)
      .delete(`/security/devices/${anotherDeviceId}`)
      .set('Cookie', `refreshToken=${token}`)
      .expect(HTTP_STATUS.FORBIDDEN_403);
  });

  it('should return 404 if device does not exist', async () => {
    const randomDeviceId = crypto.randomUUID();

    await request(app)
      .delete(`/security/devices/${randomDeviceId}`)
      .set('Cookie', `refreshToken=${token}`)
      .expect(HTTP_STATUS.NOT_FOUND_404);
  });

  it('should return 204 and delete device', async () => {
    expect(await sessionsRepo.findDevice(deviceId)).not.toBeNull();

    await request(app)
      .delete(`/security/devices/${deviceId}`)
      .set('Cookie', `refreshToken=${token}`)
      .expect(HTTP_STATUS.NO_CONTENT_204);

    expect(await sessionsRepo.findDevice(deviceId)).toBeNull();
  });
});
