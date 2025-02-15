import { DeviceType, SessionType } from './sessions-types.js';
import { Repository } from '../../infrastructure/db/repository.js';

export class SessionsRepo extends Repository<SessionType> {
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

    const session = await this.collection.findOne({ userId });
    if (!session) {
      // const _id = new ObjectId();
      const insertResult = await this.collection.insertOne({ userId, devices: [newDevice] });
      // console.log(insertResult);
    } else {
      const updateResult = await this.collection.updateOne({ userId }, { $push: { devices: newDevice } });
      // console.log(updateResult);
    }
  }

  async deleteDevice(deviceId: string): Promise<void> {
    await this.collection.updateOne({ 'devices.id': deviceId }, { $pull: { devices: { id: deviceId } } });
  }

  async deleteOtherDevices(deviceId: string): Promise<void> {
    await this.collection.updateOne(
      { 'devices.id': deviceId },
      { $pull: { devices: { id: { $ne: deviceId } } } },
    );
  }
}
