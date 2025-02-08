import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../../app.js';
import { HTTP_STATUS } from '../../common/types/http-status-codes.js';
import { dbName, mongoCluster } from '../../infrastructure/db/db.js';
import { usersQueryRepo, usersRepo } from '../../instances/repositories.js';

describe('DELETE USER', () => {
  beforeAll(async () => {
    await mongoCluster.run();
    await mongoCluster.dropDb(dbName);
  });

  afterAll(async () => {
    await mongoCluster.stop();
    // await mongoMemoryServer.stop();
  });

  const user01 = {
    login: `NewUser01`,
    hash: `somehash01`,
    email: `example01@gmail.com`,
    createdAt: new Date().toISOString(),
  };

  const user02 = {
    login: `NewUser02`,
    hash: `somehash02`,
    email: `example02@gmail.com`,
    createdAt: new Date().toISOString(),
  };

  let id01: string;
  let id02: string;

  it('should return 204 and delete user by id', async () => {
    id01 = (await usersRepo.createUser(user01.login, user01.email, user01.hash, user01.createdAt)).id;
    id02 = (await usersRepo.createUser(user02.login, user02.email, user02.hash, user02.createdAt)).id;

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
