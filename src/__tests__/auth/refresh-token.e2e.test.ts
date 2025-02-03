import request from 'supertest';
import jwt from 'jsonwebtoken';
import { mongoClient, mongoCluster } from '../../infrastructure/db/db.js';
import { SETTINGS } from '../../settings.js';
import { ObjectId } from 'mongodb';
import { app } from '../../app.js';
import { HTTP_STATUS } from '../../common/types/http-status-codes.js';
import { JwtPayloadType } from '../../auth/auth-types.js';
import { sessionsRepo } from '../../features/sessions/sessions-repo.js';

beforeAll(async () => {
  await mongoClient.connect();
  await mongoCluster.dropDb(SETTINGS.DB_NAME);
});

afterAll(async () => {
  await mongoClient.close();
});

describe('REFRESH-TOKEN', () => {
  const sessionsColl = sessionsRepo.getCollection();

  const userId = new ObjectId().toString();

  const payload = { userId };
  const secret = SETTINGS.JWT_PRIVATE_KEY!;
  const token = jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: '20 s' });

  it('should return unauthorized 401 if no token sent', async () => {
    await request(app).post('/auth/refresh-token').expect(HTTP_STATUS.UNAUTHORIZED_401);
  });

  it('should return unauthorized 401 for not existing session', async () => {
    await request(app)
      .post('/auth/refresh-token')
      .set('Cookie', `refreshToken=${token}`)
      .expect(HTTP_STATUS.UNAUTHORIZED_401);
  });

  it('should return unauthorized 401 if an invalid token is sent', async () => {
    const { iat } = jwt.decode(token) as JwtPayloadType;
    await sessionsColl.insertOne({ _id: new ObjectId(), userId, iat });

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
    const acessJwtPayload = jwt.verify(accessToken, SETTINGS.JWT_PRIVATE_KEY!) as JwtPayloadType;
    expect(acessJwtPayload.userId).toEqual(userId);

    const cookies = response.headers['set-cookie'];
    expect(cookies).toBeDefined;

    const cookiesArray = Array.isArray(cookies) ? cookies : [cookies];
    const tokenCookie = cookiesArray.find((cookie: string) => cookie.startsWith('refreshToken='));
    expect(tokenCookie).toBeDefined;
    const refreshToken = tokenCookie.split('; ')[0].split('=')[1];
    expect(jwt.verify(refreshToken, SETTINGS.JWT_PRIVATE_KEY!)).not.toThrow;
    const refreshJwtPayload = jwt.verify(refreshToken, SETTINGS.JWT_PRIVATE_KEY!) as JwtPayloadType;
    expect(refreshJwtPayload.userId).toEqual(userId);
  });

  it('it should return unauthorized if the user sends the same token a second time', async () => {
    await request(app)
      .post('/auth/refresh-token')
      .set('Cookie', `refreshToken=${token}`)
      .expect(HTTP_STATUS.UNAUTHORIZED_401);
  });
});
