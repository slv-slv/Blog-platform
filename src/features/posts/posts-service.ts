import { inject, injectable } from 'inversify';
import { PostViewType } from './posts-types.js';
import { PostsRepo } from './posts-repo.js';
import { RESULT_STATUS } from '../../common/types/result-status-codes.js';
import { Result } from '../../common/types/result-object.js';
import { PostLikesService } from '../likes/posts/post-likes-service.js';

@injectable()
export class PostsService {
  constructor(
    @inject(PostsRepo) private postsRepo: PostsRepo,
    @inject(PostLikesService) private postLikesService: PostLikesService,
  ) {}

  async createPost(
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
  ): Promise<Result<PostViewType | null>> {
    const createdAt = new Date().toISOString();
    const newPost = await this.postsRepo.createPost(title, shortDescription, content, blogId, createdAt);
    if (!newPost) {
      return {
        status: RESULT_STATUS.NOT_FOUND,
        errorMessage: 'Not found',
        extensions: [{ message: 'Blog not found', field: 'blogId' }],
        data: null,
      };
    }

    const postId = newPost.id;

    await this.postLikesService.createLikesInfo(postId);

    const likesInfo = this.postLikesService.getDefaultLikesInfo();

    return {
      status: RESULT_STATUS.CREATED,
      data: { ...newPost, likesInfo },
    };
  }

  async updatePost(
    id: string,
    title: string,
    shortDescription: string,
    content: string,
  ): Promise<Result<null>> {
    const updateResult = await this.postsRepo.updatePost(id, title, shortDescription, content);
    if (!updateResult) {
      return {
        status: RESULT_STATUS.NOT_FOUND,
        errorMessage: 'Not found',
        extensions: [{ message: 'Post not found', field: 'id' }],
        data: null,
      };
    }

    return {
      status: RESULT_STATUS.NO_CONTENT,
      data: null,
    };
  }

  async deletePost(id: string): Promise<Result<null>> {
    const deleteResult = await this.postsRepo.deletePost(id);
    if (!deleteResult) {
      return {
        status: RESULT_STATUS.NOT_FOUND,
        errorMessage: 'Not found',
        extensions: [{ message: 'Post not found', field: 'id' }],
        data: null,
      };
    }

    await this.postLikesService.deleteLikesInfo(id);

    return {
      status: RESULT_STATUS.NO_CONTENT,
      data: null,
    };
  }
}
