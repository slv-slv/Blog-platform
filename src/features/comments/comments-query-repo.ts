import { Collection, ObjectId } from 'mongodb';
import { CommentType, CommentDbType, CommentsPaginatedType } from './comments-types.js';
import { PagingParams } from '../../common/types/paging-params.js';
import { inject, injectable } from 'inversify';
import { Model } from 'mongoose';

@injectable()
export class CommentsQueryRepo {
  constructor(@inject('CommentModel') private model: Model<CommentDbType>) {}

  async getCommentsForPost(postId: string, pagingParams: PagingParams): Promise<CommentsPaginatedType> {
    const { sortBy, sortDirection, pageNumber, pageSize } = pagingParams;

    const totalCount = await this.model.countDocuments({ postId });
    const pagesCount = Math.ceil(totalCount / pageSize);

    const commentsWithObjectId = await this.model
      .find({ postId }, { postId: 0 })
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .lean();

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
    const comment = await this.model.findOne({ _id }, { _id: 0, postId: 0 }).lean();
    if (!comment) {
      return null;
    }
    return { id, ...comment };
  }
}
