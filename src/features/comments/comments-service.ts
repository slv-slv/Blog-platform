import { Result } from '../../common/types/result-object.js';
import { RESULT_STATUS } from '../../common/types/result-status-codes.js';
import { CurrentUserType } from '../users/user-types.js';
import { CommentType } from './comment-types.js';
import { commentsRepo } from './comments-repo.js';

export const commentsService = {
  createComment: async (
    postId: string,
    content: string,
    user: CurrentUserType,
  ): Promise<Result<CommentType>> => {
    const createdAt = new Date().toISOString();
    const newComment = await commentsRepo.createComment(postId, content, user, createdAt);

    return {
      status: RESULT_STATUS.SUCCESS,
      data: newComment,
    };
  },

  updateComment: async (id: string, content: string): Promise<Result<null>> => {
    const isUpdated = await commentsRepo.updateComment(id, content);
    // Дублирование логики, так как в контроллере извлекаем владельца комментария для авторизации
    if (!isUpdated) {
      return {
        status: RESULT_STATUS.NOT_FOUND,
        errorMessage: 'Not Found',
        extensions: [{ message: 'Comment not Found', field: 'commentId' }],
        data: null,
      };
    }
    return {
      status: RESULT_STATUS.NO_CONTENT,
      data: null,
    };
  },

  deleteComment: async (id: string): Promise<Result<null>> => {
    const isDeleted = await commentsRepo.deleteComment(id);
    // Дублирование логики, так как в контроллере извлекаем владельца комментария для авторизации
    if (!isDeleted) {
      return {
        status: RESULT_STATUS.NOT_FOUND,
        errorMessage: 'Not Found',
        extensions: [{ message: 'Comment not Found', field: 'commentId' }],
        data: null,
      };
    }
    return {
      status: RESULT_STATUS.NO_CONTENT,
      data: null,
    };
  },
};
