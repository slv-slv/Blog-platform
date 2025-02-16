import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import request from 'supertest';
import { dbName, mongoCluster } from '../../../infrastructure/db/db.js';
import { app } from '../../../app.js';
import { HTTP_STATUS } from '../../../common/types/http-status-codes.js';
import { container } from '../../../ioc/container.js';
import { UsersService } from '../../../features/users/users-service.js';

const usersService = container.get(UsersService);

beforeAll(async () => {
  await mongoCluster.run();
  await mongoCluster.dropDb(dbName);
});

afterAll(async () => {
  await mongoCluster.stop();
  // await mongoMemoryServer.stop();
});

describe('PASSWORD RECOVERY', () => {
  const login = 'NewUser';
  const email = 'slvsl@vk.com';
  const password = 'somepassword';

  it('should return 400 if invalid email is sent', async () => {
    await request(app)
      .post('/auth/password-recovery')
      .send({ email: 'invalid^ email@gmail.com' })
      .expect(HTTP_STATUS.BAD_REQUEST_400);

    await request(app)
      .post('/auth/password-recovery')
      .send({ email: '  ' })
      .expect(HTTP_STATUS.BAD_REQUEST_400);
  });

  it('should return 204 if not registered email is sent', async () => {
    await request(app).post('/auth/password-recovery').send({ email }).expect(HTTP_STATUS.NO_CONTENT_204);
  });

  it('should return 204 if registered email is sent', async () => {
    await usersService.createUser(login, email, password);

    await request(app).post('/auth/password-recovery').send({ email }).expect(HTTP_STATUS.NO_CONTENT_204);
  });
});
