import { SETTINGS } from '../../settings.js';
import { db } from '../../db/db.js';
import { UserDBType, UserType } from '../../types/user-types.js';
import { ObjectId } from 'mongodb';

export const usersColl = db.collection<UserDBType>(SETTINGS.DB_COLLECTIONS.USERS);

export const usersRepo = {
  createUser: async (login: string, email: string, hash: string, createdAt: string): Promise<UserType> => {
    const newUser = { login, email, hash, createdAt };
    const createResult = await usersColl.insertOne(newUser);
    const insertedUser = await usersColl.findOne({ _id: createResult.insertedId }, { projection: { _id: 0, hash: 0 } });
    const id = createResult.insertedId.toString();
    return { id, ...insertedUser } as UserType;
  },

  deleteUser: async (id: string): Promise<boolean> => {
    const _id = new ObjectId(id);
    const deleteResult = await usersColl.deleteOne({ _id });
    if (!deleteResult.deletedCount) {
      return false;
    }
    return true;
  },

  isLoginUnique: async (login: string): Promise<boolean> => {
    const user = await usersColl.findOne({ login });
    if (user) {
      return false;
    }
    return true;
  },

  isEmailUnique: async (email: string): Promise<boolean> => {
    const user = await usersColl.findOne({ email });
    if (user) {
      return false;
    }
    return true;
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
