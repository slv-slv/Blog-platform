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
import { UsersService } from '../../../features/users/users-service.js';
import { SessionsQueryRepo } from '../../../security/sessions/sessions-query-repo.js';
import mongoose from 'mongoose';
import { UserModel } from '../../../features/users/users-model.js';

const usersService = container.get(UsersService);
const sessionsQueryRepo = container.get(SessionsQueryRepo);

beforeAll(async () => {
  await mongoose.connect(mongoUri, { dbName });
  await mongoose.connection.dropDatabase();
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('LOGIN', () => {
  const login = 'NewUser';
  const email = 'example@gmail.com';
  const password = 'somepassword';

  let userId: string;

  it('should return 400 status code if login or password has incorrect value', async () => {
    const user = await usersService.createUser(login, email, password);
    userId = user.data!.id;

    await request(app)
      .post('/auth/login')
      .send({ loginOrEmail: login, password: 12345 })
      .expect(HTTP_STATUS.BAD_REQUEST_400);

    await request(app)
      .post('/auth/login')
      .send({ loginOrEmail: email, password: ' ' })
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
      .send({ loginOrEmail: login, password: 'somepassword1' })
      .expect(HTTP_STATUS.UNAUTHORIZED_401);

    await request(app)
      .post('/auth/login')
      .send({ loginOrEmail: 'newUser', password })
      .expect(HTTP_STATUS.UNAUTHORIZED_401);
  });

  it('should return 401 status code if user is not confirmed', async () => {
    await UserModel.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          'confirmation.isConfirmed': false,
          'confirmation.expiration': new Date().toISOString(),
        },
      },
    );

    await request(app)
      .post('/auth/login')
      .send({ loginOrEmail: login, password })
      .expect(HTTP_STATUS.UNAUTHORIZED_401);
  });

  it('should return valid access token for confirmed user', async () => {
    await UserModel.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { 'confirmation.isConfirmed': true, 'confirmation.expiration': null } },
    );

    const response = await request(app)
      .post('/auth/login')
      .send({ loginOrEmail: login, password })
      .expect(HTTP_STATUS.OK_200);

    const { accessToken } = response.body;
    expect(jwt.verify(accessToken, SETTINGS.JWT_PRIVATE_KEY!)).not.toThrow;
  });

  it('should return valid refresh token in cookie', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ loginOrEmail: login, password })
      .expect(HTTP_STATUS.OK_200);

    const setCookiesHeader = response.headers['set-cookie'];
    const cookies = setCookie.parse(setCookiesHeader, { map: true });
    expect(cookies).toBeDefined;

    const refreshToken = cookies.refreshToken.value;
    expect(jwt.verify(refreshToken, SETTINGS.JWT_PRIVATE_KEY!)).not.toThrow;

    const payload = jwt.verify(refreshToken, SETTINGS.JWT_PRIVATE_KEY!);
    const { userId, deviceId, iat } = payload as JwtRefreshPayload;

    const session = await sessionsQueryRepo.isSessionActive(userId, deviceId, iat);
    expect(session).not.toBeNull;
  });
});
