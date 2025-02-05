import { ObjectId } from 'mongodb';
import { PagingParams } from '../../common/types/paging-params.js';
import {
  CONFIRMATION_STATUS,
  ConfirmationInfo,
  CurrentUserType,
  UserDbType,
  UsersPaginatedViewModel,
  UserType,
} from './users-types.js';
import { Repository } from '../../infrastructure/db/repository.js';

export class UsersQueryRepo extends Repository<UserDbType> {
  async getAllUsers(
    searchLoginTerm: string,
    searchEmailTerm: string,
    pagingParams: PagingParams,
  ): Promise<UsersPaginatedViewModel> {
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

    const totalCount = await this.collection.countDocuments(filter);
    const pagesCount = Math.ceil(totalCount / pageSize);

    const usersWithObjectId = await this.collection
      .find(filter, { projection: { hash: 0 } })
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray();

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
    const user = await this.collection.findOne(filter, { projection: { hash: 0 } });
    if (!user) {
      return null;
    }
    const { _id, login, email, createdAt } = user;
    const id = _id.toString();
    return { id, login, email, createdAt };
  }

  async getCurrentUser(userId: string): Promise<CurrentUserType | null> {
    const _id = new ObjectId(userId);
    const user = await this.collection.findOne({ _id }, { projection: { email: 1, login: 1 } });
    if (!user) {
      return null;
    }
    const { email, login } = user;
    return { email, login, userId };
  }

  async isConfirmed(loginOrEmail: string): Promise<boolean> {
    const filter = loginOrEmail.includes('@') ? { email: loginOrEmail } : { login: loginOrEmail };
    const user = await this.collection.findOne(filter, { projection: { _id: 0, 'confirmation.status': 1 } });
    if (!user) {
      return false;
    }
    return user.confirmation.status === CONFIRMATION_STATUS.CONFIRMED;
  }

  async getConfirmationInfo(code: string): Promise<ConfirmationInfo | null> {
    const user = await this.collection.findOne(
      { 'confirmation.code': code },
      { projection: { confirmation: 1 } },
    );
    if (!user) {
      return null;
    }
    return user.confirmation;
  }

  async isLoginUnique(login: string): Promise<boolean> {
    const loginCount = await this.collection.countDocuments({ login });
    return loginCount === 0;
  }

  async isEmailUnique(email: string): Promise<boolean> {
    const emailCount = await this.collection.countDocuments({ email });
    return emailCount === 0;
  }

  async getPasswordHash(loginOrEmail: string): Promise<string | null> {
    const filter = loginOrEmail.includes('@') ? { email: loginOrEmail } : { login: loginOrEmail };
    const user = await this.collection.findOne(filter, { projection: { _id: 0, hash: 1 } });
    if (!user) {
      return null;
    }
    return user.hash;
  }
}
