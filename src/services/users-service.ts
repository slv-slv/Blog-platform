import { usersRepo } from '../repositories/business-logic/users-repo.js';
import { UserType } from '../types/user-types.js';
import bcrypt from 'bcrypt';

export const usersService = {
  createUser: async (login: string, email: string, password: string): Promise<UserType> => {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
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

  checkPassword: async (loginOrEmail: string, password: string): Promise<boolean> => {
    const hash = await usersRepo.getPasswordHash(loginOrEmail);
    if (!hash) {
      return false;
    }
    return await bcrypt.compare(password, hash);
  },
};
