import { Collection } from 'mongodb';
import { DeviceType, DeviceViewType, SessionDbType } from './sessions-types.js';
import { inject, injectable } from 'inversify';
import { Model } from 'mongoose';

@injectable()
export class SessionsRepo {
  constructor(@inject('SessionModel') private model: Model<SessionDbType>) {}

  async findDevice(deviceId: string): Promise<DeviceViewType | null> {
    const session = await this.model.findOne({ 'devices.id': deviceId }).lean();

    if (!session) {
      return null;
    }
    const device = session.devices.find((device: DeviceType) => device.id === deviceId)!;

    return {
      ip: device.ip,
      title: device.name,
      lastActiveDate: new Date(device.iat * 1000).toISOString(),
      deviceId: device.id,
    };
  }

  async getDeviceOwner(deviceId: string): Promise<string | null> {
    const session = await this.model.findOne({ 'devices.id': deviceId }, { userId: 1 }).lean();

    if (!session) {
      return null;
    }

    return session.userId;
  }

  async createSession(
    userId: string,
    deviceId: string,
    deviceName: string,
    ip: string,
    iat: number,
    exp: number,
  ): Promise<void> {
    const newDevice: DeviceType = {
      id: deviceId,
      name: deviceName,
      ip,
      iat,
      exp,
    };

    const session = await this.model.findOne({ userId }).lean();
    if (!session) {
      await this.model.insertOne({ userId, devices: [newDevice] });
    } else {
      await this.model.updateOne({ userId }, { $push: { devices: newDevice } });
    }
  }

  async deleteDevice(deviceId: string): Promise<void> {
    await this.model.updateOne({ 'devices.id': deviceId }, { $pull: { devices: { id: deviceId } } });
  }

  async deleteOtherDevices(deviceId: string): Promise<void> {
    await this.model.updateOne({ 'devices.id': deviceId }, { $pull: { devices: { id: { $ne: deviceId } } } });
  }
}
