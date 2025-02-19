import { BlogDbType, BlogsPaginatedType, BlogType } from './blogs-types.js';
import { PagingParams } from '../../common/types/paging-params.js';
import { inject, injectable } from 'inversify';
import { Collection, ObjectId } from 'mongodb';
import { Model } from 'mongoose';

@injectable()
export class BlogsQueryRepo {
  constructor(@inject('BlogModel') private model: Model<BlogDbType>) {}

  async getAllBlogs(searchNameTerm: string | null, pagingParams: PagingParams): Promise<BlogsPaginatedType> {
    const { sortBy, sortDirection, pageNumber, pageSize } = pagingParams;

    const filter = searchNameTerm ? { name: { $regex: searchNameTerm, $options: 'i' } } : {};

    const totalCount = await this.model.countDocuments(filter);
    const pagesCount = Math.ceil(totalCount / pageSize);

    const blogsWithObjectId = await this.model
      .find(filter)
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .lean();

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
    const blog = await this.model.findOne({ _id }, { _id: 0 }).lean();
    if (!blog) {
      return null;
    }
    return { id, ...blog };
  }
}
