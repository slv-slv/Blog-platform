import { inject, injectable } from 'inversify';
import { PostType } from './posts-types.js';
import { PostsRepo } from './posts-repo.js';
import { RESULT_STATUS } from '../../common/types/result-status-codes.js';
import { Result } from '../../common/types/result-object.js';

@injectable()
export class PostsService {
  constructor(@inject(PostsRepo) private postsRepo: PostsRepo) {}

  async createPost(
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
  ): Promise<Result<PostType | null>> {
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

    return {
      status: RESULT_STATUS.CREATED,
      data: newPost,
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

    return {
      status: RESULT_STATUS.NO_CONTENT,
      data: null,
    };
  }
}
