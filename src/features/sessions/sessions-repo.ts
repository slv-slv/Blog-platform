import { ObjectId } from 'mongodb';
import { db } from '../../infrastructure/db/db.js';
import { SETTINGS } from '../../settings.js';
import { SessionDbType } from './sessions-types.js';

export const sessionsColl = db.collection<SessionDbType>(SETTINGS.DB_COLLECTIONS.SESSIONS);

export const sessionsRepo = {
  createSession: async (userId: string, iat: number): Promise<void> => {
    await sessionsColl.deleteMany({ userId });

    const _id = new ObjectId();
    await sessionsColl.insertOne({ _id, userId, iat });
  },
};
