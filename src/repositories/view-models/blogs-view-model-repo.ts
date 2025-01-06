import { BlogsPaginatedViewModel, BlogType } from '../../types/blog-types.js';
import { PaginationParams } from '../../types/pagination-params.js';
import { blogsColl } from '../business-logic/blogs-repo.js';

export const blogsViewModelRepo = {
  getAllBlogs: async (
    searchNameTerm: string | null,
    paginationParams: PaginationParams,
  ): Promise<BlogsPaginatedViewModel> => {
    const { sortBy, sortDirection, pageNumber, pageSize } = paginationParams;

    const filter = searchNameTerm ? { name: { $regex: searchNameTerm, $options: 'i' } } : {};

    const totalCount = await blogsColl.countDocuments(filter);
    const pagesCount = Math.ceil(totalCount / pageSize);

    const blogs = await blogsColl
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
      items: blogs,
    };
  },

  findBlog: async (id: string): Promise<BlogType | null> => {
    const foundBlog = await blogsColl.findOne({ id }, { projection: { _id: 0 } });
    if (!foundBlog) {
      return null;
    }
    return foundBlog;
  },
};
