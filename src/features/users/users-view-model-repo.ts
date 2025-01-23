import { ObjectId } from 'mongodb';
import { PagingParams } from '../../common/types/paging-params.js';
import { CurrentUserType, UsersPaginatedViewModel, UserType } from './user-types.js';
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

  findUser: async (loginOrEmail: string): Promise<UserType> => {
    const filter = loginOrEmail.includes('@') ? { email: loginOrEmail } : { login: loginOrEmail };
    const user = await usersColl.findOne(filter, { projection: { hash: 0 } });
    const { _id, login, email, createdAt } = user!;
    const id = _id.toString();
    return { id, login, email, createdAt };
  },

  getCurrentUser: async (userId: string): Promise<CurrentUserType> => {
    const _id = new ObjectId(userId);
    const user = await usersColl.findOne({ _id }, { projection: { email: 1, login: 1 } });
    const { email, login } = user!;
    return { email, login, userId };
  },
};
