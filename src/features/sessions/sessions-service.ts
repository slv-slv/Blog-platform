import { Result } from '../../common/types/result-object.js';
import { RESULT_STATUS } from '../../common/types/result-status-codes.js';
import { sessionsRepo } from './sessions-repo.js';

class SessionsService {
  async createSession(userId: string, iat: number): Promise<void> {
    await sessionsRepo.createSession(userId, iat);
  }

  async deleteSession(userId: string, iat: number): Promise<void> {
    await sessionsRepo.deleteSession(userId, iat);
  }

  async verifySession(userId: string, iat: number): Promise<Result<null>> {
    const result = await sessionsRepo.verifySession(userId, iat);

    if (!result) {
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
