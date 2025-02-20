import { inject, injectable } from 'inversify';
import { Result } from '../../common/types/result-object.js';
import { RESULT_STATUS } from '../../common/types/result-status-codes.js';
import { CurrentUserType } from '../users/users-types.js';
import { CommentsRepo } from './comments-repo.js';
import { LikesService } from '../likes/likes-service.js';
import { CommentLikesQueryRepo } from '../likes/likes-query-repo.js';
import { CommentViewType } from './comments-types.js';

@injectable()
export class CommentsService {
  constructor(
    @inject(CommentsRepo) private commentsRepo: CommentsRepo,
    @inject(LikesService) private likesService: LikesService,
    @inject(CommentLikesQueryRepo) private commentLikesQueryRepo: CommentLikesQueryRepo,
  ) {}

  async createComment(
    postId: string,
    content: string,
    user: CurrentUserType,
  ): Promise<Result<CommentViewType>> {
    const createdAt = new Date().toISOString();
    const newComment = await this.commentsRepo.createComment(postId, content, user, createdAt);

    const commentId = newComment.id;
    const userId = user.userId;

    await this.likesService.createLikesInfo(commentId);
    const likesInfo = await this.commentLikesQueryRepo.getLikesInfo(commentId, userId);

    return {
      status: RESULT_STATUS.CREATED,
      data: { ...newComment, likesInfo },
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

  async deleteComment(id: string): Promise<void> {
    await this.commentsRepo.deleteComment(id);
    await this.likesService.deleteLikesInfo(id);
  }
}
