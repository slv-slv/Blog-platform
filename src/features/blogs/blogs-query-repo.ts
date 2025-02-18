import { BlogDbType, BlogsPaginatedViewModel, BlogType } from './blogs-types.js';
import { PagingParams } from '../../common/types/paging-params.js';
import { inject, injectable } from 'inversify';
import { Collection, ObjectId } from 'mongodb';

@injectable()
export class BlogsQueryRepo {
  constructor(@inject('BlogsCollection') private collection: Collection<BlogDbType>) {}

  async getAllBlogs(
    searchNameTerm: string | null,
    pagingParams: PagingParams,
  ): Promise<BlogsPaginatedViewModel> {
    const { sortBy, sortDirection, pageNumber, pageSize } = pagingParams;

    const filter = searchNameTerm ? { name: { $regex: searchNameTerm, $options: 'i' } } : {};

    const totalCount = await this.collection.countDocuments(filter);
    const pagesCount = Math.ceil(totalCount / pageSize);

    const blogsWithObjectId = await this.collection
      .find(filter)
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    const blogs = blogsWithObjectId.map((blog) => {
      return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership,
      };
    });

    return {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount,
      items: blogs,
    };
  }

  async findBlog(id: string): Promise<BlogType | null> {
    if (!ObjectId.isValid(id)) {
      return null;
    }
    const _id = new ObjectId(id);
    const blog = await this.collection.findOne({ _id }, { projection: { _id: 0 } });
    if (!blog) {
      return null;
    }
    return { id, ...blog };
  }
}
