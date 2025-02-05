import { CONFIRMATION_STATUS, UserType } from './users-types.js';
import { authService } from '../../instances/services.js';
import { emailService } from '../../infrastructure/email/email-service.js';
import { RESULT_STATUS } from '../../common/types/result-status-codes.js';
import { Result } from '../../common/types/result-object.js';
import crypto from 'crypto';
import { SETTINGS } from '../../settings.js';
import { usersQueryRepo, usersRepo } from '../../instances/repositories.js';

export class UsersService {
  async createUser(login: string, email: string, password: string): Promise<UserType> {
    const hash = await authService.hashPassword(password);
    const createdAt = new Date().toISOString();
    return await usersRepo.createUser(login, email, hash, createdAt);
  }

  async registerUser(login: string, email: string, password: string): Promise<UserType> {
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
  }

  async updateConfirmationCode(email: string): Promise<string | null> {
    const code = crypto.randomUUID();

    const currentDate = new Date();
    const hours = currentDate.getHours();
    const expiration = new Date(currentDate.setHours(hours + SETTINGS.CODE_LIFETIME_HOURS)).toISOString();

    await usersRepo.updateConfirmationCode(email, code, expiration);

    // const isUpdated = await usersRepo.updateConfirmationCode(email, code, expiration);

    // if (!isUpdated) {
    //   return null;
    // }

    // await emailService.sendConfirmation(email, code);

    return code;
  }

  async confirmUser(code: string): Promise<Result<null>> {
    const confirmationInfo = await usersQueryRepo.getConfirmationInfo(code);
    if (!confirmationInfo) {
      return {
        status: RESULT_STATUS.BAD_REQUEST,
        errorMessage: 'Bad Request',
        extensions: [{ message: 'Invalid confirmation code', field: 'code' }],
        data: null,
      };
    }

    if (confirmationInfo.status === CONFIRMATION_STATUS.CONFIRMED) {
      return {
        status: RESULT_STATUS.BAD_REQUEST,
        errorMessage: 'Bad Request',
        extensions: [{ message: 'Email already confirmed', field: 'code' }],
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
  }

  async deleteUser(id: string): Promise<boolean> {
    return await usersRepo.deleteUser(id);
  }

  async isLoginUnique(login: string): Promise<boolean> {
    return await usersQueryRepo.isLoginUnique(login);
  }

  async isEmailUnique(email: string): Promise<boolean> {
    return await usersQueryRepo.isEmailUnique(email);
  }

  async isConfirmed(email: string): Promise<boolean> {
    return await usersQueryRepo.isConfirmed(email);
  }
}
