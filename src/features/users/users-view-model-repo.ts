import { ObjectId } from 'mongodb';
import { PagingParams } from '../../common/types/paging-params.js';
import {
  CONFIRMATION_STATUS,
  ConfirmationInfo,
  CurrentUserType,
  UsersPaginatedViewModel,
  UserType,
} from './users-types.js';
import { usersColl } from './users-repo.js';

export const usersViewModelRepo = {
  getAllUsers: async (
    searchLoginTerm: string,
    searchEmailTerm: string,
    pagingParams: PagingParams,
  ): Promise<UsersPaginatedViewModel> => {
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

    const totalCount = await usersColl.countDocuments(filter);
    const pagesCount = Math.ceil(totalCount / pageSize);

    const usersWithObjectId = await usersColl
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
  },

  findUser: async (loginOrEmail: string): Promise<UserType | null> => {
    const filter = loginOrEmail.includes('@') ? { email: loginOrEmail } : { login: loginOrEmail };
    const user = await usersColl.findOne(filter, { projection: { hash: 0 } });
    if (!user) {
      return null;
    }
    const { _id, login, email, createdAt } = user;
    const id = _id.toString();
    return { id, login, email, createdAt };
  },

  getCurrentUser: async (userId: string): Promise<CurrentUserType> => {
    const _id = new ObjectId(userId);
    const user = await usersColl.findOne({ _id }, { projection: { email: 1, login: 1 } });
    const { email, login } = user!;
    return { email, login, userId };
  },

  isConfirmed: async (email: string): Promise<boolean> => {
    const user = await usersColl.findOne({ email }, { projection: { _id: 0, 'confirmation.status': 1 } });
    if (!user) {
      return false;
    }
    return user.confirmation.status === CONFIRMATION_STATUS.CONFIRMED;
  },

  getConfirmationInfo: async (code: string): Promise<ConfirmationInfo | null> => {
    const user = await usersColl.findOne({ 'confirmation.code': code }, { projection: { confirmation: 1 } });
    if (!user) {
      return null;
    }
    return user.confirmation;
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
