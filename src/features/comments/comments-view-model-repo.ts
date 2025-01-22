import { ObjectId } from 'mongodb';
import { db } from '../../db/db.js';
import { SETTINGS } from '../../settings.js';
import { CommentType, CommentDBType, CommentsPaginatedViewModel } from './comment-types.js';
import { PagingParams } from '../../common/types/paging-params.js';

export const commentsColl = db.collection<CommentDBType>(SETTINGS.DB_COLLECTIONS.COMMENTS);

export const commentsViewModelRepo = {
  getCommentsForPost: async (
    postId: string,
    pagingParams: PagingParams,
  ): Promise<CommentsPaginatedViewModel | null> => {
    const { sortBy, sortDirection, pageNumber, pageSize } = pagingParams;

    const totalCount = await commentsColl.countDocuments({ postId });
    if (totalCount === 0) {
      return null;
    }

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
    const _id = new ObjectId(id);
    const foundComment = await commentsColl.findOne({ _id }, { projection: { _id: 0 } });
    if (!foundComment) {
      return null;
    }
    return { id, ...foundComment };
  },
};
