import { BlogsPaginatedViewModel, BlogType } from './blogs-types.js';
import { PagingParams } from '../../common/types/paging-params.js';
import { Repository } from '../../infrastructure/db/repository.js';

export class BlogsQueryRepo extends Repository<BlogType> {
  async getAllBlogs(
    searchNameTerm: string | null,
    pagingParams: PagingParams,
  ): Promise<BlogsPaginatedViewModel> {
    const { sortBy, sortDirection, pageNumber, pageSize } = pagingParams;

    const filter = searchNameTerm ? { name: { $regex: searchNameTerm, $options: 'i' } } : {};

    const totalCount = await this.collection.countDocuments(filter);
    const pagesCount = Math.ceil(totalCount / pageSize);

    const blogs = await this.collection
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
  }

  async findBlog(id: string): Promise<BlogType | null> {
    const blog = await this.collection.findOne({ id }, { projection: { _id: 0 } });
    if (!blog) {
      return null;
    }
    return blog;
  }
}
