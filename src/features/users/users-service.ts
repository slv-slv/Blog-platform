import { CONFIRMATION_STATUS, ConfirmationInfo, PasswordRecoveryInfo, UserType } from './users-types.js';
import { RESULT_STATUS } from '../../common/types/result-status-codes.js';
import { Result } from '../../common/types/result-object.js';
import crypto from 'crypto';
import { SETTINGS } from '../../settings.js';
import { inject, injectable } from 'inversify';
import { UsersRepo } from './users-repo.js';
import { UsersQueryRepo } from './users-query-repo.js';
import { AuthService } from '../../security/auth/auth-service.js';
import { EmailService } from '../../infrastructure/email/email-service.js';

@injectable()
export class UsersService {
  constructor(
    @inject(UsersRepo) private usersRepo: UsersRepo,
    @inject(UsersQueryRepo) private usersQueryRepo: UsersQueryRepo,
    @inject(AuthService) private authService: AuthService,
    @inject(EmailService) private emailService: EmailService,
  ) {}

  async createUser(login: string, email: string, password: string): Promise<UserType> {
    const hash = await this.authService.hashPassword(password);
    const createdAt = new Date().toISOString();
    const confirmation: ConfirmationInfo = {
      status: CONFIRMATION_STATUS.CONFIRMED,
      code: null,
      expiration: null,
    };
    const passwordRecovery: PasswordRecoveryInfo = { code: null, expiration: null };

    return await this.usersRepo.createUser(login, email, hash, createdAt, confirmation, passwordRecovery);
  }

  async registerUser(login: string, email: string, password: string): Promise<UserType> {
    const hash = await this.authService.hashPassword(password);
    const createdAt = new Date().toISOString();

    const code = crypto.randomUUID();

    const currentDate = new Date();
    const hours = currentDate.getHours();
    const expiration = new Date(
      currentDate.setHours(hours + SETTINGS.CONFIRMATION_CODE_LIFETIME),
    ).toISOString();
    const confirmation = {
      status: CONFIRMATION_STATUS.NOT_CONFIRMED,
      code,
      expiration,
    };
    const passwordRecovery: PasswordRecoveryInfo = { code: null, expiration: null };

    // await emailService.sendConfirmationCode(email, code);

    return await this.usersRepo.createUser(login, email, hash, createdAt, confirmation, passwordRecovery);
  }

  async sendConfirmationCode(email: string): Promise<string | null> {
    const code = crypto.randomUUID();

    const currentDate = new Date();
    const hours = currentDate.getHours();
    const expiration = new Date(
      currentDate.setHours(hours + SETTINGS.CONFIRMATION_CODE_LIFETIME),
    ).toISOString();

    await this.usersRepo.updateConfirmationCode(email, code, expiration);

    // emailService.sendConfirmationCode(email, code);

    return code;
  }

  async sendRecoveryCode(email: string): Promise<string | null> {
    const code = crypto.randomUUID();

    const currentDate = new Date();
    const hours = currentDate.getHours();
    const expiration = new Date(currentDate.setHours(hours + SETTINGS.RECOVERY_CODE_LIFETIME)).toISOString();

    await this.usersRepo.updateRecoveryCode(email, code, expiration);

    // await emailService.sendRecoveryCode(email, code);

    return code;
  }

  async confirmUser(code: string): Promise<Result<null>> {
    const confirmationInfo = await this.usersQueryRepo.getConfirmationInfo(code);
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

    await this.usersRepo.confirmUser(code);

    return {
      status: RESULT_STATUS.NO_CONTENT,
      data: null,
    };
  }

  async updatePassword(recoveryCode: string, newPassword: string): Promise<Result<null>> {
    const passwordRecoveryInfo = await this.usersQueryRepo.getPasswordRecoveryInfo(recoveryCode);

    if (!passwordRecoveryInfo) {
      return {
        status: RESULT_STATUS.BAD_REQUEST,
        errorMessage: 'Bad Request',
        extensions: [{ message: 'Invalid recovery code', field: 'recoveryCode' }],
        data: null,
      };
    }

    const expirationDate = new Date(passwordRecoveryInfo.expiration!);
    const currentDate = new Date();

    if (expirationDate < currentDate) {
      return {
        status: RESULT_STATUS.BAD_REQUEST,
        errorMessage: 'Bad Request',
        extensions: [{ message: 'The recovery code has expired', field: 'recoveryCode' }],
        data: null,
      };
    }

    const hash = await this.authService.hashPassword(newPassword);
    await this.usersRepo.updatePassword(recoveryCode, hash);

    return {
      status: RESULT_STATUS.NO_CONTENT,
      data: null,
    };
  }

  async deleteUser(id: string): Promise<boolean> {
    return await this.usersRepo.deleteUser(id);
  }

  async isLoginUnique(login: string): Promise<boolean> {
    return await this.usersQueryRepo.isLoginUnique(login);
  }

  async isEmailUnique(email: string): Promise<boolean> {
    return await this.usersQueryRepo.isEmailUnique(email);
  }

  async isConfirmed(email: string): Promise<boolean> {
    return await this.usersQueryRepo.isConfirmed(email);
  }
}
