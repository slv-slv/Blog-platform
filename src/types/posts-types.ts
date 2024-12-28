import { ObjectId } from 'mongodb';

export type PostType = {
  _id: ObjectId;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  isMembership: boolean;
};
