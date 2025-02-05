import { Result } from '../../common/types/result-object.js';
import { RESULT_STATUS } from '../../common/types/result-status-codes.js';
import { sessionsRepo } from '../../instances/repositories.js';

class SessionsService {
  async createSession(userId: string, iat: number): Promise<void> {
    await sessionsRepo.createSession(userId, iat);
  }

  async deleteSession(userId: string, iat: number): Promise<void> {
    await sessionsRepo.deleteSession(userId, iat);
  }

  async verifySession(userId: string, iat: number): Promise<Result<null>> {
    const isSessionActive = await sessionsRepo.verifySession(userId, iat);

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
}

export const sessionsService = new SessionsService();
