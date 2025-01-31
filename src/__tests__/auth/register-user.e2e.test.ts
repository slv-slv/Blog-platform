import request from 'supertest';
import { SETTINGS } from '../../settings.js';
import { mongoClient, mongoCluster } from '../../infrastructure/db/db.js';
import { app } from '../../app.js';
import { HTTP_STATUS } from '../../common/types/http-status-codes.js';
import { usersColl } from '../../features/users/users-repo.js';
import { CONFIRMATION_STATUS } from '../../features/users/users-types.js';

beforeAll(async () => {
  await mongoClient.connect();
  await mongoCluster.dropDb(SETTINGS.DB_NAME);
});

afterAll(async () => {
  await mongoClient.close();
});

describe('REGISTER USER', () => {
  const newUser = {
    login: 'NewUser',
    password: 'NewPassword',
    email: 'slvsl@vk.com',
  };

  it('should register new user', async () => {
    const response = await request(app)
      .post('/auth/registration')
      .send(newUser)
      .expect(HTTP_STATUS.NO_CONTENT_204);

    const insertedUser = await usersColl.findOne({ login: newUser.login });

    expect(insertedUser).toHaveProperty('_id');
    expect(insertedUser).toHaveProperty('login', newUser.login);
    expect(insertedUser).toHaveProperty('email', newUser.email);
    expect(insertedUser).toHaveProperty('hash');
    expect(insertedUser).toHaveProperty('createdAt');
    expect(new Date(insertedUser!.createdAt)).toBeInstanceOf(Date);
    expect(insertedUser).toHaveProperty('confirmation');
    expect(insertedUser!.confirmation.status).toEqual(CONFIRMATION_STATUS.NOT_CONFIRMED);
    expect(insertedUser!.confirmation.code).not.toBeNull;
    expect(insertedUser!.confirmation.expiration).not.toBeNull;
  });

  it('should not register already confirmed user', async () => {
    await usersColl.updateOne(
      { login: newUser.login },
      { $set: { 'confirmation.status': CONFIRMATION_STATUS.CONFIRMED } },
    );

    const response = await request(app)
      .post('/auth/registration')
      .send(newUser)
      .expect(HTTP_STATUS.BAD_REQUEST_400);
  });
});
