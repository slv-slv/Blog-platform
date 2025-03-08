import { inject, injectable } from 'inversify';
import { Result } from '../../../common/types/result-object.js';
import { RESULT_STATUS } from '../../../common/types/result-status-codes.js';
import { ExtendedLikesInfoViewType, LikeStatus } from '../types/likes-types.js';
import { PostsRepo } from '../../posts/posts-repo.js';
import { PostLikesRepo } from './post-likes-repo.js';
import { PostLikesType } from './post-likes-types.js';

@injectable()
export class PostLikesService {
  constructor(
    @inject(PostsRepo) private postsRepo: PostsRepo,
    @inject(PostLikesRepo) private postLikesRepo: PostLikesRepo,
  ) {}

  async setLikeStatus(postId: string, userId: string, likeStatus: LikeStatus): Promise<Result<null>> {
    const post = await this.postsRepo.findPost(postId);
    if (!post) {
      return {
        status: RESULT_STATUS.NOT_FOUND,
        errorMessage: 'Post not found',
        extensions: [{ message: 'Post not found', field: 'postId' }],
        data: null,
      };
    }

    const currentLikeStatus = await this.postLikesRepo.getLikeStatus(postId, userId);
    if (likeStatus === currentLikeStatus) {
      return {
        status: RESULT_STATUS.NO_CONTENT,
        data: null,
      };
    }

    const createdAt = new Date();

    switch (likeStatus) {
      case LikeStatus.None:
        await this.postLikesRepo.setNone(postId, userId);
        break;
      case LikeStatus.Like:
        await this.postLikesRepo.setLike(postId, userId, createdAt);
        break;
      case LikeStatus.Dislike:
        await this.postLikesRepo.setDislike(postId, userId, createdAt);
        break;
    }

    return {
      status: RESULT_STATUS.NO_CONTENT,
      data: null,
    };
  }

  async createLikesInfo(postId: string): Promise<void> {
    const likesInfo: PostLikesType = {
      postId,
      likes: [],
      dislikes: [],
    };

    await this.postLikesRepo.createLikesInfo(likesInfo);
  }

  async deleteLikesInfo(postId: string): Promise<void> {
    await this.postLikesRepo.deleteLikesInfo(postId);
  }

  getDefaultLikesInfo(): ExtendedLikesInfoViewType {
    return {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: LikeStatus.None,
      newestLikes: [],
    };
  }
}
