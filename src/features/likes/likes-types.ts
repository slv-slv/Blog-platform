import { WithId } from 'mongodb';

export type CommentLikesType = {
  commentId: string;
  likes: {
    count: number;
    userIds: string[];
  };
  dislikes: {
    count: number;
    userIds: string[];
  };
};

export type CommentLikesDbType = WithId<CommentLikesType>;

export type LikesInfoViewType = {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
};

export enum LikeStatus {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike',
}
