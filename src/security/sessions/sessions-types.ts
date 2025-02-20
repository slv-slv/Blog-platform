import { ObjectId, WithId } from 'mongodb';

export type SessionDbType = WithId<{
  userId: string;
  devices: DeviceType[];
}>;

export type DeviceType = {
  id: string;
  name: string;
  ip: string;
  iat: number;
  exp: number;
};

export type DeviceViewType = {
  ip: string;
  title: string;
  lastActiveDate: string;
  deviceId: string;
};
