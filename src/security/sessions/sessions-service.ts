import { Result } from '../../common/types/result-object.js';
import { RESULT_STATUS } from '../../common/types/result-status-codes.js';
import { sessionsQueryRepo, sessionsRepo } from '../../instances/repositories.js';

export class SessionsService {
  async createSession(
    userId: string,
    deviceId: string,
    deviceName: string,
    ip: string,
    iat: number,
    exp: number,
  ): Promise<void> {
    await sessionsRepo.deleteDevice(deviceId);
    await sessionsRepo.createSession(userId, deviceId, deviceName, ip, iat, exp);
  }

  async verifySession(userId: string, deviceId: string, iat: number): Promise<Result<null>> {
    const isSessionActive = await sessionsQueryRepo.verifySession(userId, deviceId, iat);

    if (!isSessionActive) {
      return {
        status: RESULT_STATUS.UNAUTHORIZED,
        errorMessage: 'Unauthorized',
        data: null,
      };
    }

    return {
      status: RESULT_STATUS.SUCCESS,
      data: null,
    };
  }

  async deleteDevice(deviceId: string): Promise<void> {
    await sessionsRepo.deleteDevice(deviceId);
  }

  async deleteOtherDevices(deviceId: string): Promise<void> {
    await sessionsRepo.deleteOtherDevices(deviceId);
  }
}
