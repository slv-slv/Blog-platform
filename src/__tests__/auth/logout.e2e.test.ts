import request from 'supertest';
import jwt from 'jsonwebtoken';
import { dbName, mongoCluster } from '../../infrastructure/db/db.js';
import { SETTINGS } from '../../settings.js';
import { ObjectId } from 'mongodb';
import { app } from '../../app.js';
import { HTTP_STATUS } from '../../common/types/http-status-codes.js';
import { JwtPayloadType } from '../../auth/auth-types.js';
import { sessionsColl } from '../../infrastructure/db/collections.js';

beforeAll(async () => {
  await mongoCluster.run();
  await mongoCluster.dropDb(dbName);
});

afterAll(async () => {
  await mongoCluster.stop();
});

describe('LOGOUT', () => {
  const userId = new ObjectId().toString();

  const payload = { userId };
  const secret = SETTINGS.JWT_PRIVATE_KEY!;
  const token = jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: '20 s' });
  const { iat } = jwt.decode(token) as JwtPayloadType;

  it('should return 204 and delete session if a valid token is sent ', async () => {
    await sessionsColl.insertOne({ _id: new ObjectId(), userId, iat });

    await request(app)
      .post('/auth/logout')
      .set('Cookie', `refreshToken=${token}`)
      .expect(HTTP_STATUS.NO_CONTENT_204);

    expect(await sessionsColl.countDocuments({ userId })).toEqual(0);
  });
});
