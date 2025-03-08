import { inject, injectable } from 'inversify';
import { Model } from 'mongoose';
import { PostLikesDbType } from './post-likes-types.js';
import { ExtendedLikesInfoViewType } from '../types/likes-types.js';
import { PostLikesRepo } from './post-likes-repo.js';
import { UsersQueryRepo } from '../../users/users-query-repo.js';

@injectable()
export class PostLikesQueryRepo {
  constructor(
    @inject('PostLikesModel') private model: Model<PostLikesDbType>,
    @inject(PostLikesRepo) private postLikesRepo: PostLikesRepo,
    @inject(UsersQueryRepo) private usersQueryRepo: UsersQueryRepo,
  ) {}

  async getLikesInfo(postId: string, userId: string): Promise<ExtendedLikesInfoViewType> {
    const likesCount = await this.postLikesRepo.getLikesCount(postId);
    const dislikesCount = await this.postLikesRepo.getDislikesCount(postId);
    const myStatus = await this.postLikesRepo.getLikeStatus(postId, userId);

    const likesNumber = 3;
    const post = await this.model.aggregate([
      { $match: { postId } },
      { $unwind: '$likes' },
      { $sort: { 'likes.createdAt': -1 } },
      { $limit: likesNumber },
      {
        $group: {
          _id: '$_id',
          likes: { $push: '$likes' },
        },
      },
      {
        $project: {
          _id: 0,
          likes: 1,
        },
      },
    ]);

    const newestLikes =
      (await Promise.all(
        post[0]?.likes.map(async (like: { userId: string; createdAt: Date }) => {
          const addedAt = like.createdAt.toISOString();
          const userId = like.userId;

          const user = await this.usersQueryRepo.getCurrentUser(userId);
          const login = user?.login;

          return { addedAt, userId, login };
        }),
      )) || [];

    return { likesCount, dislikesCount, myStatus, newestLikes };
  }
}
