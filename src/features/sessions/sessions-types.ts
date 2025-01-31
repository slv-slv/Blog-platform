import { ObjectId } from 'mongodb';

export type SessionType = {
  userId: string;
  iat: number;
};

export type SessionDbType = {
  _id: ObjectId;
  userId: string;
  iat: number;
};
