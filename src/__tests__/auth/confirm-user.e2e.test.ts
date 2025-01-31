import request from 'supertest';
import { ObjectId } from 'mongodb';
import { mongoClient, mongoCluster } from '../../infrastructure/db/db.js';
import { SETTINGS } from '../../settings.js';
import { app } from '../../app.js';
import { usersColl } from '../../features/users/users-repo.js';
import { CONFIRMATION_STATUS, UserDBType } from '../../features/users/users-types.js';

beforeAll(async () => {
  await mongoClient.connect();
  await mongoCluster.dropDb(SETTINGS.DB_NAME);
});

afterAll(async () => {
  await mongoClient.close();
});

describe('CONFIRM USER', () => {
  const pastDate = new Date();
  pastDate.setHours(pastDate.getHours() - 1);

  const futureDate = new Date();
  futureDate.setHours(futureDate.getHours() + 1);

  const newUser: UserDBType = {
    _id: new ObjectId(),
    login: 'NewUser',
    email: 'some.email@gmail.com',
    hash: 'somehash',
    createdAt: new Date().toISOString(),
    confirmation: {
      status: CONFIRMATION_STATUS.NOT_CONFIRMED,
      code: '0d56a34c-9eaf-473f-842c-309ab6c2c9df',
      expiration: pastDate.toISOString(),
    },
  };

  it('should not confirm not existing user', async () => {
    await request(app)
      .post('/auth/registration-confirmation')
      .send({ code: newUser.confirmation.code })
      .expect(400);
  });

  it('should not confirm user with expired code', async () => {
    await usersColl.insertOne(newUser);

    await request(app)
      .post('/auth/registration-confirmation')
      .send({ code: newUser.confirmation.code })
      .expect(400);
  });

  it('should confirm user with valid code', async () => {
    await usersColl.updateOne(
      { login: newUser.login },
      { $set: { 'confirmation.expiration': futureDate.toISOString() } },
    );

    await request(app)
      .post('/auth/registration-confirmation')
      .send({ code: newUser.confirmation.code })
      .expect(204);

    const confirmedUser = await usersColl.findOne({ email: newUser.email });

    expect(confirmedUser!.confirmation.status).toEqual(CONFIRMATION_STATUS.CONFIRMED);
    expect(confirmedUser!.confirmation.expiration).toBeNull;
  });

  it('should not confirm already confirmed user', async () => {
    await request(app)
      .post('/auth/registration-confirmation')
      .send({ code: newUser.confirmation.code })
      .expect(400);
  });
});
