import { PostDbType, PostsPaginatedType, PostType } from './posts-types.js';
import { PagingParams } from '../../common/types/paging-params.js';
import { inject, injectable } from 'inversify';
import { Collection, ObjectId } from 'mongodb';
import { Model } from 'mongoose';

@injectable()
export class PostsQueryRepo {
  constructor(@inject('PostModel') private model: Model<PostDbType>) {}

  async getPosts(pagingParams: PagingParams, blogId?: string): Promise<PostsPaginatedType> {
    const { sortBy, sortDirection, pageNumber, pageSize } = pagingParams;

    const filter = blogId ? { blogId } : {};

    const totalCount = await this.model.countDocuments(filter);
    const pagesCount = Math.ceil(totalCount / pageSize);

    const postsWithObjectId = await this.model
      .find(filter)
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .lean();

    const posts = postsWithObjectId.map((post) => {
      return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
      };
    });

    return {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount,
      items: posts,
    };
  }
}
