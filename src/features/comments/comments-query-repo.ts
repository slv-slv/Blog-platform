import { ObjectId } from 'mongodb';
import { CommentType, CommentDbType, CommentsPaginatedViewModel } from './comments-types.js';
import { PagingParams } from '../../common/types/paging-params.js';
import { Repository } from '../../infrastructure/db/repository.js';
import { ICommentsCollection } from '../../infrastructure/db/collections.js';
import { inject, injectable } from 'inversify';

@injectable()
export class CommentsQueryRepo {
  constructor(@inject('CommentsCollection') private collection: ICommentsCollection) {}

  async getCommentsForPost(postId: string, pagingParams: PagingParams): Promise<CommentsPaginatedViewModel> {
    const { sortBy, sortDirection, pageNumber, pageSize } = pagingParams;

    const totalCount = await this.collection.countDocuments({ postId });
    const pagesCount = Math.ceil(totalCount / pageSize);

    const commentsWithObjectId = await this.collection
      .find({ postId }, { projection: { postId: 0 } })
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    const comments = commentsWithObjectId.map((comment) => {
      return {
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: comment.commentatorInfo,
        createdAt: comment.createdAt,
      };
    });

    return {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount,
      items: comments,
    };
  }

  async findComment(id: string): Promise<CommentType | null> {
    if (!ObjectId.isValid(id)) {
      return null;
    }
    const _id = new ObjectId(id);
    const comment = await this.collection.findOne({ _id }, { projection: { _id: 0, postId: 0 } });
    if (!comment) {
      return null;
    }
    return { id, ...comment };
  }
}
