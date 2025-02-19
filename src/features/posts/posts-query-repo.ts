import { PostDbType, PostsPaginatedType, PostType } from './posts-types.js';
import { PagingParams } from '../../common/types/paging-params.js';
import { inject, injectable } from 'inversify';
import { Collection, ObjectId } from 'mongodb';

@injectable()
export class PostsQueryRepo {
  constructor(@inject('PostsCollection') private collection: Collection<PostDbType>) {}

  async getPosts(pagingParams: PagingParams, blogId?: string): Promise<PostsPaginatedType> {
    const { sortBy, sortDirection, pageNumber, pageSize } = pagingParams;

    const filter = blogId ? { blogId } : {};

    const totalCount = await this.collection.countDocuments(filter);
    const pagesCount = Math.ceil(totalCount / pageSize);

    const postsWithObjectId = await this.collection
      .find(filter)
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray();

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

  async findPost(id: string): Promise<PostType | null> {
    if (!ObjectId.isValid(id)) {
      return null;
    }
    const _id = new ObjectId(id);
    const post = await this.collection.findOne({ _id }, { projection: { _id: 0 } });
    if (!post) {
      return null;
    }
    return { id, ...post };
  }
}
