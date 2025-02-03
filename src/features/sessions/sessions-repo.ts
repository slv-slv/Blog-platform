import { ObjectId } from 'mongodb';
import { SETTINGS } from '../../settings.js';
import { SessionDbType } from './sessions-types.js';
import { Repository } from '../../infrastructure/db/repository.js';

class SessionsRepo extends Repository<SessionDbType> {
  constructor(collectionName: string) {
    super(collectionName);
  }

  async createSession(userId: string, iat: number): Promise<void> {
    await this.collection.deleteMany({ userId });

    const _id = new ObjectId();
    await this.collection.insertOne({ _id, userId, iat });
  }

  async deleteSession(userId: string, iat: number): Promise<void> {
    await this.collection.deleteOne({ userId, iat });
  }

  async verifySession(userId: string, iat: number): Promise<boolean> {
    const session = await this.collection.findOne({ userId, iat });
    return session !== null;
  }
}

export const sessionsRepo = new SessionsRepo(SETTINGS.DB_COLLECTIONS.SESSIONS);
