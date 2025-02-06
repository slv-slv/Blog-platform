import request from 'supertest';
import jwt from 'jsonwebtoken';
import { dbName, mongoCluster } from '../../../infrastructure/db/db.js';
import { SETTINGS } from '../../../settings.js';
import { ObjectId } from 'mongodb';
import { app } from '../../../app.js';
import { HTTP_STATUS } from '../../../common/types/http-status-codes.js';
import { JwtRefreshPayload } from '../../../security/auth/auth-types.js';
import { sessionsQueryRepo, sessionsRepo } from '../../../instances/repositories.js';

beforeAll(async () => {
  // await initDb();
  await mongoCluster.run();
  await mongoCluster.dropDb(dbName);
});

afterAll(async () => {
  await mongoCluster.stop();
  // await mongoMemoryServer.stop();
});

describe('GET-ACTIVE-DEVICES', () => {
  const userId = new ObjectId().toString();
  const deviceId = crypto.randomUUID();

  const payload = { userId, deviceId };
  const secret = SETTINGS.JWT_PRIVATE_KEY!;
  const token = jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: '20 s' });
  const { iat, exp } = jwt.decode(token) as JwtRefreshPayload;

  it('should return 401 if refresh token with inactive device is sent', async () => {
    for (let i = 0; i < 5; i += 1) {
      const deviceId = crypto.randomUUID();
      const deviceName = `Nokia 110${i}`;
      const ip = '192.168.0.1';

      await sessionsRepo.createSession(userId, deviceId, deviceName, ip, iat, exp);
    }

    await request(app)
      .delete('/security/devices')
      .set('Cookie', `refreshToken=${token}`)
      .expect(HTTP_STATUS.UNAUTHORIZED_401);
  });

  it('should return array of active devices of user', async () => {
    await sessionsRepo.createSession(userId, deviceId, 'Siemens SX1', '127.0.0.1', iat, exp);

    const response = await request(app)
      .delete('/security/devices')
      .set('Cookie', `refreshToken=${token}`)
      .expect(HTTP_STATUS.NO_CONTENT_204);

    const devices = await sessionsQueryRepo.getActiveDevices(userId);
    expect(devices).toHaveLength(1);
    expect(devices[0].deviceId).toBe(deviceId);
  });
});
