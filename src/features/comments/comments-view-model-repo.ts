import { ObjectId } from 'mongodb';
import { db } from '../../infrastructure/db/db.js';
import { SETTINGS } from '../../settings.js';
import { CommentType, CommentDBType, CommentsPaginatedViewModel } from './comment-types.js';
import { PagingParams } from '../../common/types/paging-params.js';

export const commentsColl = db.collection<CommentDBType>(SETTINGS.DB_COLLECTIONS.COMMENTS);

export const commentsViewModelRepo = {
  getCommentsForPost: async (
    postId: string,
    pagingParams: PagingParams,
  ): Promise<CommentsPaginatedViewModel> => {
    const { sortBy, sortDirection, pageNumber, pageSize } = pagingParams;

    const totalCount = await commentsColl.countDocuments({ postId });
    const pagesCount = Math.ceil(totalCount / pageSize);

    const commentsWithObjectId = await commentsColl
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
  },

  findComment: async (id: string): Promise<CommentType | null> => {
    if (!ObjectId.isValid(id)) {
      return null;
    }
    const _id = new ObjectId(id);
    const comment = await commentsColl.findOne({ _id }, { projection: { _id: 0, postId: 0 } });
    if (!comment) {
      return null;
    }
    return { id, ...comment };
  },
};
