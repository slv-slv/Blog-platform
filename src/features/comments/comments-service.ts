import { inject, injectable } from 'inversify';
import { Result } from '../../common/types/result-object.js';
import { RESULT_STATUS } from '../../common/types/result-status-codes.js';
import { CurrentUserType } from '../users/users-types.js';
import { CommentType } from './comments-types.js';
import { CommentsRepo } from './comments-repo.js';

@injectable()
export class CommentsService {
  constructor(@inject(CommentsRepo) private commentsRepo: CommentsRepo) {}

  async createComment(postId: string, content: string, user: CurrentUserType): Promise<Result<CommentType>> {
    const createdAt = new Date().toISOString();
    const newComment = await this.commentsRepo.createComment(postId, content, user, createdAt);

    return {
      status: RESULT_STATUS.CREATED,
      data: newComment,
    };
  }

  async updateComment(id: string, content: string): Promise<Result<null>> {
    const isUpdated = await this.commentsRepo.updateComment(id, content);
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
  }

  async deleteComment(id: string): Promise<Result<null>> {
    const isDeleted = await this.commentsRepo.deleteComment(id);
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
  }
}
