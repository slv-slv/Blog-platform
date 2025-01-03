export type PostType = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
};

export enum PostTypeKeys {
  id = 'id',
  title = 'title',
  shortDescription = 'shortDescription',
  content = 'content',
  blogId = 'blogId',
  blogName = 'blogName',
  createdAt = 'createdAt',
}

export type PostsPaginatedViewModel = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: PostType[];
};
