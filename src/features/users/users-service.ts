import { usersRepo } from './users-repo.js';
import { UserType } from './user-types.js';
import { authService } from '../../auth/auth-service.js';

export const usersService = {
  createUser: async (login: string, email: string, password: string): Promise<UserType> => {
    const hash = await authService.hashPassword(password);
    const createdAt = new Date().toISOString();
    return await usersRepo.createUser(login, email, hash, createdAt);
  },

  deleteUser: async (id: string): Promise<boolean> => {
    return await usersRepo.deleteUser(id);
  },

  isLoginUnique: async (login: string): Promise<boolean> => {
    return await usersRepo.isLoginUnique(login);
  },

  isEmailUnique: async (email: string): Promise<boolean> => {
    return await usersRepo.isEmailUnique(email);
  },
};
