import { PostsPaginatedViewModel, PostType } from './posts-types.js';
import { PagingParams } from '../../common/types/paging-params.js';
import { Repository } from '../../infrastructure/db/repository.js';

class PostsQueryRepo extends Repository<PostType> {
  constructor(collectionName: string) {
    super(collectionName);
  }

  async getPosts(pagingParams: PagingParams, blogId?: string): Promise<PostsPaginatedViewModel> {
    const { sortBy, sortDirection, pageNumber, pageSize } = pagingParams;

    const filter = blogId ? { blogId } : {};

    const totalCount = await this.collection.countDocuments(filter);
    const pagesCount = Math.ceil(totalCount / pageSize);

    const posts = await this.collection
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
  }

  async findPost(id: string): Promise<PostType | null> {
    const post = await this.collection.findOne({ id }, { projection: { _id: 0 } });
    if (!post) {
      return null;
    }
    return post;
  }
}

export const postsQueryRepo = new PostsQueryRepo('posts');
