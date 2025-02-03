import { ObjectId } from 'mongodb';
import { SETTINGS } from '../../settings.js';
import { ConfirmationInfo, CONFIRMATION_STATUS, UserDBType, UserType } from './users-types.js';
import { Repository } from '../../infrastructure/db/repository.js';

class UsersRepo extends Repository<UserDBType> {
  constructor(collectionName: string) {
    super(collectionName);
  }

  async createUser(
    login: string,
    email: string,
    hash: string,
    createdAt: string,
    confirmation: ConfirmationInfo = {
      status: CONFIRMATION_STATUS.CONFIRMED,
      code: null,
      expiration: null,
    },
  ): Promise<UserType> {
    const _id = new ObjectId();
    const newUser = { _id, login, email, hash, createdAt, confirmation };
    const createResult = await this.collection.insertOne(newUser);
    const id = createResult.insertedId.toString();
    return { id, login, email, createdAt };
  }

  async updateConfirmationCode(email: string, code: string, expiration: string): Promise<boolean> {
    const updateResult = await this.collection.updateOne(
      { email },
      { $set: { 'confirmation.code': code, 'confirmation.expiration': expiration } },
    );
    return updateResult.matchedCount > 0;
  }

  async confirmUser(code: string): Promise<boolean> {
    const updateResult = await this.collection.updateOne(
      { 'confirmation.code': code },
      { $set: { 'confirmation.status': CONFIRMATION_STATUS.CONFIRMED, 'confirmation.expiration': null } },
    );
    return updateResult.modifiedCount > 0; // Будет false если пользователь не найден или уже подтвержден
  }

  async deleteUser(id: string): Promise<boolean> {
    if (!ObjectId.isValid(id)) {
      return false;
    }
    const _id = new ObjectId(id);
    const deleteResult = await this.collection.deleteOne({ _id });
    return deleteResult.deletedCount > 0;
  }
}

export const usersRepo = new UsersRepo(SETTINGS.DB_COLLECTIONS.USERS);
