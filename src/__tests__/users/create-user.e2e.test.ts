import request from 'supertest';
import { app } from '../../app.js';
import { HTTP_STATUS } from '../../common/types/http-status-codes.js';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { mongoClient, mongoCluster } from '../../infrastructure/db/db.js';
import { SETTINGS } from '../../settings.js';
import { CONFIRMATION_STATUS } from '../../features/users/user-types.js';

describe('CREATE USER', () => {
  beforeAll(async () => {
    await mongoClient.connect();
    await mongoCluster.dropDb(SETTINGS.DB_NAME);
  });

  afterAll(async () => {
    await mongoClient.close();
  });

  const newUser = {
    login: 'NewUser123',
    password: 'qwerty123',
    email: 'example123@example.com',
  };

  it('admin should create a new user and return user object', async () => {
    const response = await request(app)
      .post('/users')
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(newUser)
      .expect(HTTP_STATUS.CREATED_201);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('login', newUser.login);
    expect(response.body).toHaveProperty('email', newUser.email);
    expect(response.body).toHaveProperty('createdAt');
    expect(new Date(response.body.createdAt)).toBeInstanceOf(Date);
    expect(response.body).toHaveProperty('confirmation');
    expect(response.body!.confirmation.status).toEqual(CONFIRMATION_STATUS.CONFIRMED);
    expect(response.body!.confirmation.code).toBeNull;
    expect(response.body!.confirmation.expiration).toBeNull;
  });
});
