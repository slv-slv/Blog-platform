import { WithId } from 'mongodb';

export type BlogType = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
};

export type BlogDbType = WithId<{
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
}>;

export enum BlogTypeKeys {
  // id = 'id',
  name = 'name',
  description = 'description',
  websiteUrl = 'websiteUrl',
  createdAt = 'createdAt',
  isMembership = 'isMembership',
}

export type BlogsPaginatedType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: BlogType[];
};
