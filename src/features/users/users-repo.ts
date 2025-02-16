import { ObjectId } from 'mongodb';
import {
  ConfirmationInfo,
  CONFIRMATION_STATUS,
  UserDbType,
  UserType,
  PasswordRecoveryInfo,
} from './users-types.js';
import { Repository } from '../../infrastructure/db/repository.js';
import { inject, injectable } from 'inversify';
import { IUsersCollection } from '../../infrastructure/db/collections.js';

@injectable()
export class UsersRepo {
  constructor(@inject('UsersCollection') private collection: IUsersCollection) {}

  async findUser(loginOrEmail: string): Promise<UserDbType | null> {
    const filter = loginOrEmail.includes('@') ? { email: loginOrEmail } : { login: loginOrEmail };
    return await this.collection.findOne(filter);
  }

  async createUser(
    login: string,
    email: string,
    hash: string,
    createdAt: string,
    confirmation: ConfirmationInfo,
    passwordRecovery: PasswordRecoveryInfo,
  ): Promise<UserType> {
    const _id = new ObjectId();
    const newUser = { _id, login, email, hash, createdAt, confirmation, passwordRecovery };
    const createResult = await this.collection.insertOne(newUser);
    const id = createResult.insertedId.toString();
    return { id, login, email, createdAt };
  }

  async updateConfirmationCode(email: string, code: string, expiration: string): Promise<void> {
    await this.collection.updateOne(
      { email },
      { $set: { 'confirmation.code': code, 'confirmation.expiration': expiration } },
    );
  }

  async updateRecoveryCode(email: string, code: string, expiration: string): Promise<void> {
    await this.collection.updateOne(
      { email },
      { $set: { 'passwordRecovery.code': code, 'passwordRecovery.expiration': expiration } },
    );
  }

  async updatePassword(recoveryCode: string, hash: string) {
    await this.collection.updateOne(
      { 'passwordRecovery.code': recoveryCode },
      { $set: { hash, 'passwordRecovery.code': null, 'passwordRecovery.expiration': null } },
    );
  }

  async confirmUser(code: string): Promise<void> {
    await this.collection.updateOne(
      { 'confirmation.code': code },
      { $set: { 'confirmation.status': CONFIRMATION_STATUS.CONFIRMED, 'confirmation.expiration': null } },
    );
    // return updateResult.modifiedCount > 0; // Будет false если пользователь не найден или уже подтвержден
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
