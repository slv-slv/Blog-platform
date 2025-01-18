import { PagingParams } from '../types/paging-params.js';
import { UsersPaginatedViewModel } from './user-types.js';
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

    const usersObjectId = await usersColl
      .find(filter, { projection: { hash: 0 } })
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    const users = usersObjectId.map((user) => {
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
};
