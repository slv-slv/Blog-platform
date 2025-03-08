import { WithId } from 'mongodb';

export type CommentLikesType = {
  commentId: string;
  likes: { userId: string; createdAt: Date }[];
  dislikes: { userId: string; createdAt: Date }[];
};

export type CommentLikesDbType = WithId<CommentLikesType>;
