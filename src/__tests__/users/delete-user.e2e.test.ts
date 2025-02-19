import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../../app.js';
import { HTTP_STATUS } from '../../common/types/http-status-codes.js';
import { dbName, mongoUri } from '../../infrastructure/db/db.js';
import { container } from '../../ioc/container.js';
import { UsersService } from '../../features/users/users-service.js';
import mongoose from 'mongoose';

const usersService = container.get(UsersService);

describe('DELETE USER', () => {
  beforeAll(async () => {
    await mongoose.connect(mongoUri, { dbName });
    await mongoose.connection.dropDatabase();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  const user01 = {
    login: `NewUser01`,
    email: `example01@gmail.com`,
    password: 'somepassword',
  };

  const user02 = {
    login: `NewUser02`,
    email: `example02@gmail.com`,
    password: 'somepassword',
  };

  let id01: string;
  let id02: string;

  it('should return 204 and delete user by id', async () => {
    const createdUser01 = await usersService.createUser(user01.login, user01.email, user01.password);
    id01 = createdUser01.id;

    const createdUser02 = await usersService.createUser(user02.login, user02.email, user02.password);
    id02 = createdUser02.id;

    let response = await request(app)
      .get('/users')
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .expect(HTTP_STATUS.OK_200);
    expect(response.body.items).toHaveLength(2);

    await request(app)
      .delete(`/users/${id01}`)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .expect(HTTP_STATUS.NO_CONTENT_204);

    response = await request(app)
      .get('/users')
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .expect(HTTP_STATUS.OK_200);
    expect(response.body.items).toHaveLength(1);
  });

  it('should return 404 if user does not exist', async () => {
    await request(app)
      .delete(`/users/${id01}`)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .expect(HTTP_STATUS.NOT_FOUND_404);
  });

  it('should return 401 if credentials are incorrect', async () => {
    await request(app).delete(`/users/${id01}`).expect(HTTP_STATUS.UNAUTHORIZED_401);
    await request(app).delete(`/users/${id02}`).expect(HTTP_STATUS.UNAUTHORIZED_401);
  });
});
