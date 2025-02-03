import request from 'supertest';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { mongoClient, mongoCluster } from '../../infrastructure/db/db.js';
import { SETTINGS } from '../../settings.js';
import { CONFIRMATION_STATUS, UserDBType } from '../../features/users/users-types.js';
import { ObjectId } from 'mongodb';
import { app } from '../../app.js';
import { HTTP_STATUS } from '../../common/types/http-status-codes.js';
import { JwtPayloadType } from '../../auth/auth-types.js';
import { usersRepo } from '../../features/users/users-repo.js';
import { sessionsRepo } from '../../features/sessions/sessions-repo.js';

beforeAll(async () => {
  await mongoClient.connect();
  await mongoCluster.dropDb(SETTINGS.DB_NAME);
});

afterAll(async () => {
  await mongoClient.close();
});

describe('LOGIN', () => {
  const usersColl = usersRepo.getCollection();
  const sessionsColl = sessionsRepo.getCollection();

  const password = 'somepassword';
  const hash = bcrypt.hashSync(password, 10);

  const newUser: UserDBType = {
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

  it('should return 200 status code if credentials are correct', async () => {
    await request(app)
      .post('/auth/login')
      .send({ loginOrEmail: newUser.login, password })
      .expect(HTTP_STATUS.OK_200);

    await request(app)
      .post('/auth/login')
      .send({ loginOrEmail: newUser.email, password })
      .expect(HTTP_STATUS.OK_200);
  });

  it('should return valid access token in response body', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ loginOrEmail: newUser.login, password })
      .expect(HTTP_STATUS.OK_200);

    const { accessToken } = response.body;
    expect(jwt.verify(accessToken, SETTINGS.JWT_PRIVATE_KEY!)).not.toThrow;
    const payload = jwt.verify(accessToken, SETTINGS.JWT_PRIVATE_KEY!);
    const { userId } = payload as JwtPayloadType;
    expect(userId).toEqual(newUser._id.toString());
  });

  it('should return valid refresh token in cookie', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ loginOrEmail: newUser.login, password })
      .expect(HTTP_STATUS.OK_200);

    const cookies = response.headers['set-cookie'];
    expect(cookies).toBeDefined;

    const cookiesArray = Array.isArray(cookies) ? cookies : [cookies];
    const tokenCookie = cookiesArray.find((cookie: string) => cookie.startsWith('refreshToken='));
    expect(tokenCookie).toBeDefined;
    const refreshToken = tokenCookie.split('; ')[0].split('=')[1];
    expect(jwt.verify(refreshToken, SETTINGS.JWT_PRIVATE_KEY!)).not.toThrow;
    const payload = jwt.verify(refreshToken, SETTINGS.JWT_PRIVATE_KEY!);
    const { userId, iat } = payload as JwtPayloadType;
    expect(userId).toEqual(newUser._id.toString());

    const session = await sessionsColl.findOne({ userId });
    expect(session).not.toBeNull;
    expect(session!.iat).toEqual(iat);
  });
});
