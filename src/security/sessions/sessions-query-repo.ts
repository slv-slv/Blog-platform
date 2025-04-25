import { Collection } from 'mongodb';
import { DeviceType, DeviceViewType, SessionDbType } from './sessions-types.js';
import { inject, injectable } from 'inversify';
import { Model } from 'mongoose';

@injectable()
export class SessionsQueryRepo {
  constructor(@inject('SessionModel') private model: Model<SessionDbType>) {}

  async isSessionActive(userId: string, deviceId: string, iat: number): Promise<boolean> {
    const session = await this.model
      .findOne({ userId, devices: { $elemMatch: { id: deviceId, iat } } })
      .lean();
    return session !== null;
  }

  async getActiveDevices(userId: string): Promise<DeviceViewType[]> {
    const userSessions = await this.model.findOne({ userId }, { devices: 1 }).lean();

    return userSessions!.devices.map((device: DeviceType) => ({
      ip: device.ip,
      title: device.name,
      lastActiveDate: new Date(device.iat * 1000).toISOString(),
      deviceId: device.id,
    }));
  }
}
