import { sessionsRepo } from './sessions-repo.js';

export const sessionsService = {
  createSession: async (userId: string, iat: number): Promise<void> => {
    await sessionsRepo.createSession(userId, iat);
  },
};
