import bcrypt from 'bcrypt';
import { usersRepo } from '../features/users/users-repo.js';

export const authService = {
  hashPassword: async (password: string): Promise<string> => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  },

  checkPassword: async (loginOrEmail: string, password: string): Promise<boolean> => {
    const hash = await usersRepo.getPasswordHash(loginOrEmail);
    if (!hash) {
      return false;
    }
    return await bcrypt.compare(password, hash);
  },
};
