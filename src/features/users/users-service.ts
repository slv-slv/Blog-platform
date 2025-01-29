import { usersRepo } from './users-repo.js';
import { CONFIRMATION_STATUS, UserType } from './user-types.js';
import { authService } from '../../auth/auth-service.js';
import { emailService } from '../../infrastructure/email/email-service.js';
import { RESULT_STATUS } from '../../common/types/result-status-codes.js';
import { Result } from '../../common/types/result-object.js';
import crypto from 'crypto';
import { SETTINGS } from '../../settings.js';
import { usersViewModelRepo } from './users-view-model-repo.js';

export const usersService = {
  createUser: async (login: string, email: string, password: string): Promise<UserType> => {
    const hash = await authService.hashPassword(password);
    const createdAt = new Date().toISOString();
    return await usersRepo.createUser(login, email, hash, createdAt);
  },

  registerUser: async (login: string, email: string, password: string): Promise<UserType> => {
    const hash = await authService.hashPassword(password);
    const createdAt = new Date().toISOString();

    const code = crypto.randomUUID();

    const daysToConfirm = 1;
    const currentDate = new Date();
    const date = currentDate.getDate();
    const expiration = new Date(currentDate.setDate(date + daysToConfirm)).toISOString();
    const confirmation = {
      status: CONFIRMATION_STATUS.NOT_CONFIRMED,
      code,
      expiration,
    };

    // await emailService.sendConfirmation(email, code);

    return await usersRepo.createUser(login, email, hash, createdAt, confirmation);
  },

  updateConfirmationCode: async (email: string): Promise<string | null> => {
    const code = crypto.randomUUID();

    const currentDate = new Date();
    const hours = currentDate.getHours();
    const expiration = new Date(currentDate.setHours(hours + SETTINGS.CODE_LIFETIME_HOURS)).toISOString();

    const isUpdated = await usersRepo.updateConfirmationCode(email, code, expiration);

    if (!isUpdated) {
      return null;
    }

    // await emailService.sendConfirmation(email, code);

    return code;
  },

  confirmUser: async (code: string): Promise<Result<null>> => {
    const confirmationInfo = await usersViewModelRepo.getConfirmationInfo(code);
    if (!confirmationInfo) {
      return {
        status: RESULT_STATUS.BAD_REQUEST,
        errorMessage: 'Bad Request',
        extensions: [{ message: 'Invalid confirmation code', field: 'code' }],
        data: null,
      };
    }

    if (confirmationInfo.status === CONFIRMATION_STATUS.CONFIRMED && confirmationInfo.expiration === null) {
      return {
        status: RESULT_STATUS.BAD_REQUEST,
        errorMessage: 'Bad Request',
        extensions: [{ message: 'Invalid confirmation code', field: 'code' }],
        data: null,
      };
    }

    const expirationDate = new Date(confirmationInfo.expiration!);
    const currentDate = new Date();

    if (expirationDate < currentDate) {
      return {
        status: RESULT_STATUS.BAD_REQUEST,
        errorMessage: 'Bad Request',
        extensions: [{ message: 'The confirmation code has expired', field: 'code' }],
        data: null,
      };
    }

    await usersRepo.confirmUser(code);

    return {
      status: RESULT_STATUS.NO_CONTENT,
      data: null,
    };
  },

  deleteUser: async (id: string): Promise<boolean> => {
    return await usersRepo.deleteUser(id);
  },

  isLoginUnique: async (login: string): Promise<boolean> => {
    return await usersViewModelRepo.isLoginUnique(login);
  },

  isEmailUnique: async (email: string): Promise<boolean> => {
    return await usersViewModelRepo.isEmailUnique(email);
  },

  isConfirmed: async (email: string): Promise<boolean> => {
    return await usersViewModelRepo.isConfirmed(email);
  },
};
