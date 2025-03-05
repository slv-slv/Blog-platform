import { WithId } from 'mongodb';

export type CommentLikesType = {
  commentId: string;
  likes: { userId: { type: string; required: true }; createdAt: { type: Date; required: true } }[];
  dislikes: { userId: { type: string; required: true }; createdAt: { type: Date; required: true } }[];
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
