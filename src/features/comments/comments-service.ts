import { inject, injectable } from 'inversify';
import { Result } from '../../common/types/result-object.js';
import { RESULT_STATUS } from '../../common/types/result-status-codes.js';
import { CommentsRepo } from './comments-repo.js';
import { CommentLikesService } from '../likes/likes-service.js';
import { CommentLikesQueryRepo } from '../likes/likes-query-repo.js';
import { CommentViewType } from './comments-types.js';
import { PostsRepo } from '../posts/posts-repo.js';
import { UsersRepo } from '../users/users-repo.js';

@injectable()
export class CommentsService {
  constructor(
    @inject(CommentsRepo) private commentsRepo: CommentsRepo,
    @inject(CommentLikesQueryRepo) private commentLikesQueryRepo: CommentLikesQueryRepo,
    @inject(PostsRepo) private postsRepo: PostsRepo,
    @inject(UsersRepo) private usersRepo: UsersRepo,
    @inject(CommentLikesService) private likesService: CommentLikesService,
  ) {}

  async createComment(
    postId: string,
    content: string,
    userId: string,
  ): Promise<Result<CommentViewType | null>> {
    const post = await this.postsRepo.findPost(postId);
    if (!post) {
      return {
        status: RESULT_STATUS.NOT_FOUND,
        errorMessage: 'Not found',
        extensions: [{ message: 'Post not found', field: 'postId' }],
        data: null,
      };
    }

    const createdAt = new Date().toISOString();

    const userLogin = await this.usersRepo.getLogin(userId);
    if (!userLogin) {
      return {
        status: RESULT_STATUS.UNAUTHORIZED,
        errorMessage: 'Unauthorized',
        extensions: [{ message: 'Access denied', field: 'userId' }],
        data: null,
      };
    }

    const commentatorInfo = { userId, userLogin };

    const newComment = await this.commentsRepo.createComment(postId, content, createdAt, commentatorInfo);
    const commentId = newComment.id;

    await this.likesService.createLikesInfo(commentId);
    const likesInfo = await this.commentLikesQueryRepo.getLikesInfo(commentId, userId);

    return {
      status: RESULT_STATUS.CREATED,
      data: { ...newComment, likesInfo },
    };
  }

  async updateComment(commentId: string, content: string, userId: string): Promise<Result<null>> {
    const comment = await this.commentsRepo.findComment(commentId);
    if (!comment) {
      return {
        status: RESULT_STATUS.NOT_FOUND,
        errorMessage: 'Not Found',
        extensions: [{ message: 'Comment not found', field: 'commentId' }],
        data: null,
      };
    }

    const ownerId = comment.commentatorInfo.userId;
    if (userId !== ownerId) {
      return {
        status: RESULT_STATUS.FORBIDDEN,
        errorMessage: 'Forbidden',
        extensions: [{ message: 'Invalid userId', field: 'userId' }],
        data: null,
      };
    }

    await this.commentsRepo.updateComment(commentId, content);
    return {
      status: RESULT_STATUS.NO_CONTENT,
      data: null,
    };
  }

  async deleteComment(commentId: string, userId: string): Promise<Result<null>> {
    const comment = await this.commentsRepo.findComment(commentId);
    if (!comment) {
      return {
        status: RESULT_STATUS.NOT_FOUND,
        errorMessage: 'Not Found',
        extensions: [{ message: 'Comment not found', field: 'commentId' }],
        data: null,
      };
    }

    const ownerId = comment.commentatorInfo.userId;
    if (userId !== ownerId) {
      return {
        status: RESULT_STATUS.FORBIDDEN,
        errorMessage: 'Forbidden',
        extensions: [{ message: 'Invalid userId', field: 'userId' }],
        data: null,
      };
    }

    await this.commentsRepo.deleteComment(commentId);
    await this.likesService.deleteLikesInfo(commentId);

    return {
      status: RESULT_STATUS.NO_CONTENT,
      data: null,
    };
  }
}
