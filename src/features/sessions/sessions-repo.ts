import { ObjectId } from 'mongodb';
import { db } from '../../infrastructure/db/db.js';
import { SETTINGS } from '../../settings.js';
import { SessionDbType } from './sessions-types.js';
import { usersColl } from '../users/users-repo.js';

export const sessionsColl = db.collection<SessionDbType>(SETTINGS.DB_COLLECTIONS.SESSIONS);

export const sessionsRepo = {
  createSession: async (userId: string, iat: number): Promise<void> => {
    await sessionsColl.deleteMany({ userId });

    const _id = new ObjectId();
    await sessionsColl.insertOne({ _id, userId, iat });
  },

  deleteSession: async (userId: string, iat: number): Promise<void> => {
    await sessionsColl.deleteOne({ userId, iat });
  },

  verifySession: async (userId: string, iat: number): Promise<boolean> => {
    const session = await sessionsColl.findOne({ userId, iat });
    return session !== null;
  },
};
