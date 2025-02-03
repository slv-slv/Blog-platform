import { ObjectId } from 'mongodb';
import { SETTINGS } from '../../settings.js';
import { db } from '../../infrastructure/db/db.js';
import { ConfirmationInfo, CONFIRMATION_STATUS, UserDBType, UserType } from './users-types.js';

export const usersColl = db.collection<UserDBType>(SETTINGS.DB_COLLECTIONS.USERS);

export const usersRepo = {
  createUser: async (
    login: string,
    email: string,
    hash: string,
    createdAt: string,
    confirmation: ConfirmationInfo = {
      status: CONFIRMATION_STATUS.CONFIRMED,
      code: null,
      expiration: null,
    },
  ): Promise<UserType> => {
    const _id = new ObjectId();
    const newUser = { _id, login, email, hash, createdAt, confirmation };
    const createResult = await usersColl.insertOne(newUser);
    const id = createResult.insertedId.toString();
    return { id, login, email, createdAt };
  },

  updateConfirmationCode: async (email: string, code: string, expiration: string): Promise<boolean> => {
    const updateResult = await usersColl.updateOne(
      { email },
      { $set: { 'confirmation.code': code, 'confirmation.expiration': expiration } },
    );
    return updateResult.matchedCount > 0;
  },

  confirmUser: async (code: string): Promise<boolean> => {
    const updateResult = await usersColl.updateOne(
      { 'confirmation.code': code },
      { $set: { 'confirmation.status': CONFIRMATION_STATUS.CONFIRMED, 'confirmation.expiration': null } },
    );
    return updateResult.modifiedCount > 0; // Будет false если пользователь не найден или уже подтвержден
  },

  deleteUser: async (id: string): Promise<boolean> => {
    if (!ObjectId.isValid(id)) {
      return false;
    }
    const _id = new ObjectId(id);
    const deleteResult = await usersColl.deleteOne({ _id });
    return deleteResult.deletedCount > 0;
  },
};
