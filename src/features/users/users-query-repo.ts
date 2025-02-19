import { Collection, ObjectId } from 'mongodb';
import { PagingParams } from '../../common/types/paging-params.js';
import {
  CONFIRMATION_STATUS,
  ConfirmationInfo,
  CurrentUserType,
  PasswordRecoveryInfo,
  UserDbType,
  UsersPaginatedType,
  UserType,
} from './users-types.js';
import { inject, injectable } from 'inversify';
import { Model } from 'mongoose';

@injectable()
export class UsersQueryRepo {
  constructor(@inject('UserModel') private model: Model<UserDbType>) {}

  async getAllUsers(
    searchLoginTerm: string,
    searchEmailTerm: string,
    pagingParams: PagingParams,
  ): Promise<UsersPaginatedType> {
    const { sortBy, sortDirection, pageNumber, pageSize } = pagingParams;

    let filter = {};
    const loginFilter = searchLoginTerm ? { login: { $regex: searchLoginTerm, $options: 'i' } } : {};
    const emailFilter = searchEmailTerm ? { email: { $regex: searchEmailTerm, $options: 'i' } } : {};

    if (searchEmailTerm && searchLoginTerm) {
      filter = { $or: [loginFilter, emailFilter] };
    } else if (searchEmailTerm) {
      filter = emailFilter;
    } else if (searchLoginTerm) {
      filter = loginFilter;
    }

    const totalCount = await this.model.countDocuments(filter);
    const pagesCount = Math.ceil(totalCount / pageSize);

    const usersWithObjectId = await this.model
      .find(filter, { hash: 0 })
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .lean();

    const users = usersWithObjectId.map((user) => {
      return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt,
        confirmation: user.confirmation,
      };
    });

    return {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount,
      items: users,
    };
  }

  async findUser(loginOrEmail: string): Promise<UserType | null> {
    const filter = loginOrEmail.includes('@') ? { email: loginOrEmail } : { login: loginOrEmail };
    const user = await this.model.findOne(filter, { hash: 0 }).lean();
    if (!user) {
      return null;
    }
    const { _id, login, email, createdAt } = user;
    const id = _id.toString();
    return { id, login, email, createdAt };
  }

  async getCurrentUser(userId: string): Promise<CurrentUserType | null> {
    const _id = new ObjectId(userId);
    const user = await this.model.findOne({ _id }, { email: 1, login: 1 }).lean();
    if (!user) {
      return null;
    }
    const { email, login } = user;
    return { email, login, userId };
  }

  async isConfirmed(loginOrEmail: string): Promise<boolean> {
    const filter = loginOrEmail.includes('@') ? { email: loginOrEmail } : { login: loginOrEmail };
    const user = await this.model.findOne(filter, { _id: 0, 'confirmation.status': 1 }).lean();
    if (!user) {
      return false;
    }
    return user.confirmation.status === CONFIRMATION_STATUS.CONFIRMED;
  }

  async getConfirmationInfo(code: string): Promise<ConfirmationInfo | null> {
    const user = await this.model.findOne({ 'confirmation.code': code }, { confirmation: 1 }).lean();
    if (!user) {
      return null;
    }
    return user.confirmation;
  }

  async getPasswordRecoveryInfo(code: string): Promise<PasswordRecoveryInfo | null> {
    const user = await this.model.findOne({ 'passwordRecovery.code': code }, { passwordRecovery: 1 }).lean();
    if (!user) {
      return null;
    }
    return user.passwordRecovery;
  }

  async isLoginUnique(login: string): Promise<boolean> {
    const loginCount = await this.model.countDocuments({ login });
    return loginCount === 0;
  }

  async isEmailUnique(email: string): Promise<boolean> {
    const emailCount = await this.model.countDocuments({ email });
    return emailCount === 0;
  }

  async getPasswordHash(loginOrEmail: string): Promise<string | null> {
    const filter = loginOrEmail.includes('@') ? { email: loginOrEmail } : { login: loginOrEmail };
    const user = await this.model.findOne(filter, { _id: 0, hash: 1 }).lean();
    if (!user) {
      return null;
    }
    return user.hash;
  }
}
