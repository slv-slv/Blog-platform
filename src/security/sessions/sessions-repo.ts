import { Collection } from 'mongodb';
import { DeviceType, SessionType } from './sessions-types.js';
import { inject, injectable } from 'inversify';
import { Model } from 'mongoose';

@injectable()
export class SessionsRepo {
  constructor(@inject('SessionModel') private model: Model<SessionType>) {}

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

    const session = await this.model.findOne({ userId });
    if (!session) {
      // const _id = new ObjectId();
      const insertResult = await this.model.insertOne({ userId, devices: [newDevice] });
      // console.log(insertResult);
    } else {
      const updateResult = await this.model.updateOne({ userId }, { $push: { devices: newDevice } });
      // console.log(updateResult);
    }
  }

  async deleteDevice(deviceId: string): Promise<void> {
    await this.model.updateOne({ 'devices.id': deviceId }, { $pull: { devices: { id: deviceId } } });
  }

  async deleteOtherDevices(deviceId: string): Promise<void> {
    await this.model.updateOne({ 'devices.id': deviceId }, { $pull: { devices: { id: { $ne: deviceId } } } });
  }
}
