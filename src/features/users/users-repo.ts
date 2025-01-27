import { ObjectId } from 'mongodb';
import { SETTINGS } from '../../settings.js';
import { db } from '../../db/db.js';
import { UserDBType, UserType } from './user-types.js';

export const usersColl = db.collection<UserDBType>(SETTINGS.DB_COLLECTIONS.USERS);

export const usersRepo = {
  createUser: async (login: string, email: string, hash: string, createdAt: string): Promise<UserType> => {
    const _id = new ObjectId();
    const newUser = { _id, login, email, hash, createdAt };
    const createResult = await usersColl.insertOne(newUser);
    const insertedUser = await usersColl.findOne(
      { _id: createResult.insertedId },
      { projection: { _id: 0, hash: 0 } },
    );
    const id = createResult.insertedId.toString();
    return { id, ...insertedUser } as UserType;
  },

  deleteUser: async (id: string): Promise<boolean> => {
    if (!ObjectId.isValid(id)) {
      return false;
    }
    const _id = new ObjectId(id);
    const deleteResult = await usersColl.deleteOne({ _id });
    return deleteResult.deletedCount > 0;
  },

  isLoginUnique: async (login: string): Promise<boolean> => {
    const loginCount = await usersColl.countDocuments({ login });
    return loginCount === 0;
  },

  isEmailUnique: async (email: string): Promise<boolean> => {
    const emailCount = await usersColl.countDocuments({ email });
    return emailCount === 0;
  },

  getPasswordHash: async (loginOrEmail: string): Promise<string | null> => {
    const filter = loginOrEmail.includes('@') ? { email: loginOrEmail } : { login: loginOrEmail };
    const user = await usersColl.findOne(filter, { projection: { _id: 0, hash: 1 } });
    if (!user) {
      return null;
    }
    return user.hash;
  },
};
