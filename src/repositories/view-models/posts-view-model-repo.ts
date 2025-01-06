import { PostsPaginatedViewModel, PostType } from '../../types/post-types.js';
import { PaginationParams } from '../../types/pagination-params.js';
import { postsColl } from '../business-logic/posts-repo.js';

export const postsViewModelRepo = {
  getPosts: async (paginationParams: PaginationParams, blogId?: string): Promise<PostsPaginatedViewModel> => {
    const { sortBy, sortDirection, pageNumber, pageSize } = paginationParams;

    const filter = blogId ? { blogId } : {};

    const totalCount = await postsColl.countDocuments(filter);
    const pagesCount = Math.ceil(totalCount / pageSize);

    const posts = await postsColl
      .find(filter, { projection: { _id: 0 } })
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray();
    return {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount,
      items: posts,
    };
  },

  findPost: async (id: string): Promise<PostType | null> => {
    const foundPost = await postsColl.findOne({ id }, { projection: { _id: 0 } });
    if (!foundPost) {
      return null;
    }
    return foundPost;
  },
};
