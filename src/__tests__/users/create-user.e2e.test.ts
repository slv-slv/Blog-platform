import request from 'supertest';
import { app } from '../../app.js';
import { HTTP_STATUS } from '../../common/types/http-status-codes.js';
import { dbName, mongoCluster } from '../../infrastructure/db/db.js';

describe('CREATE USER', () => {
  beforeAll(async () => {
    // await initDb();
    await mongoCluster.run();
    await mongoCluster.dropDb(dbName);
  });

  afterAll(async () => {
    await mongoCluster.stop();
    // await mongoMemoryServer.stop();
  });

  const newUser = {
    login: 'NewUser',
    password: 'qwerty123',
    email: 'example@example.com',
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
  });
});
