import { ObjectId } from 'mongodb';

export type SessionType = {
  userId: string;
  devices: DeviceType[];
};

export type DeviceType = {
  id: string;
  name: string;
  ip: string;
  iat: number;
  exp: number;
};

export type DeviceViewModel = {
  ip: string;
  title: string;
  lastActiveDate: string;
  deviceId: string;
};
