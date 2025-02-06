import { DeviceType, DeviceViewModel, SessionDbType } from './sessions-types.js';
import { Repository } from '../../infrastructure/db/repository.js';

export class SessionsQueryRepo extends Repository<SessionDbType> {
  async verifySession(userId: string, deviceId: string, iat: number): Promise<boolean> {
    const session = await this.collection.findOne({ userId, devices: { $elemMatch: { id: deviceId, iat } } });
    return session !== null;
  }

  async findDevice(deviceId: string): Promise<DeviceViewModel | null> {
    const session = await this.collection.findOne({ 'devices.id': deviceId }, { projection: { devices: 1 } });

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

  async getActiveDevices(userId: string): Promise<DeviceViewModel[]> {
    const userSessions = await this.collection.findOne({ userId }, { projection: { devices: 1 } });

    return userSessions!.devices.map((device: DeviceType) => ({
      ip: device.ip,
      title: device.name,
      lastActiveDate: new Date(device.iat * 1000).toISOString(),
      deviceId: device.id,
    }));
  }
}
