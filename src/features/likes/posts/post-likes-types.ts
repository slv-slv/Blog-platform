import { WithId } from 'mongodb';

export type PostLikesType = {
  postId: string;
  likes: { userId: string; createdAt: Date }[];
  dislikes: { userId: string; createdAt: Date }[];
};

export type PostLikesDbType = WithId<PostLikesType>;
