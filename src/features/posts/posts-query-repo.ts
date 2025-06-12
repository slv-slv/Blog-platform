import { PostDbType, PostsPaginatedType, PostViewType } from './posts-types.js';
import { PagingParams } from '../../common/types/paging-params.js';
import { inject, injectable } from 'inversify';
import { Model } from 'mongoose';
import { PostLikesQueryRepo } from '../likes/posts/post-likes-query-repo.js';
import { ObjectId } from 'mongodb';

@injectable()
export class PostsQueryRepo {
  constructor(
    @inject('PostModel') private model: Model<PostDbType>,
    @inject(PostLikesQueryRepo) private postLikesQueryRepo: PostLikesQueryRepo,
  ) {}

  async findPost(id: string, userId: string | null): Promise<PostViewType | null> {
    if (!ObjectId.isValid(id)) {
      return null;
    }
    const _id = new ObjectId(id);
    const post = await this.model.findOne({ _id }, { _id: 0 }).lean();
    if (!post) {
      return null;
    }

    const extendedLikesInfo = await this.postLikesQueryRepo.getLikesInfo(id, userId);

    return { id, ...post, extendedLikesInfo };
  }

  async getPosts(
    userId: string | null,
    pagingParams: PagingParams,
    blogId?: string,
  ): Promise<PostsPaginatedType> {
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

    const posts = await Promise.all(
      postsWithObjectId.map(async (post) => {
        return {
          id: post._id.toString(),
          title: post.title,
          shortDescription: post.shortDescription,
          content: post.content,
          blogId: post.blogId,
          blogName: post.blogName,
          createdAt: post.createdAt,
          extendedLikesInfo: await this.postLikesQueryRepo.getLikesInfo(post._id.toString(), userId),
        };
      }),
    );

    return {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount,
      items: posts,
    };
  }
}
