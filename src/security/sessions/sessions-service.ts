import { inject, injectable } from 'inversify';
import { Result } from '../../common/types/result-object.js';
import { RESULT_STATUS } from '../../common/types/result-status-codes.js';
import { SessionsRepo } from './sessions-repo.js';
import { SessionsQueryRepo } from './sessions-query-repo.js';

@injectable()
export class SessionsService {
  constructor(
    @inject(SessionsRepo) private sessionsRepo: SessionsRepo,
    @inject(SessionsQueryRepo) private sessionsQueryRepo: SessionsQueryRepo,
  ) {}
  async createSession(
    userId: string,
    deviceId: string,
    deviceName: string,
    ip: string,
    iat: number,
    exp: number,
  ): Promise<void> {
    await this.sessionsRepo.deleteDevice(deviceId);
    await this.sessionsRepo.createSession(userId, deviceId, deviceName, ip, iat, exp);
  }

  async checkSession(userId: string, deviceId: string, iat: number): Promise<Result<null>> {
    const isSessionActive = await this.sessionsQueryRepo.isSessionActive(userId, deviceId, iat);

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
    await this.sessionsRepo.deleteDevice(deviceId);
  }

  async deleteOtherDevices(deviceId: string): Promise<void> {
    await this.sessionsRepo.deleteOtherDevices(deviceId);
  }
}
