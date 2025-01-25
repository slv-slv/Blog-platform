import { ObjectId } from 'mongodb';

export type UserType = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
};

export enum UserTypeKeys {
  id = 'id',
  login = 'login',
  email = 'email',
  createdAt = 'createdAt',
}

export type UserDBType = {
  _id: ObjectId;
  login: string;
  email: string;
  hash: string;
  createdAt: string;
};

export type CurrentUserType = {
  email: string;
  login: string;
  userId: string;
};

export type UsersPaginatedViewModel = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: UserType[];
};
