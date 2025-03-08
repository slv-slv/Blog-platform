export type LikesInfoViewType = {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
};

export type extendedLikesInfoViewType = {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
  newestLikes: {
    addedAt: string;
    userId: string;
    login: string;
  }[];
};

export enum LikeStatus {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike',
}
