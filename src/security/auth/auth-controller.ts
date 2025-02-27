import { Request, Response } from 'express';
import { HTTP_STATUS } from '../../common/types/http-status-codes.js';
import { httpCodeByResult, RESULT_STATUS } from '../../common/types/result-status-codes.js';
import { inject, injectable } from 'inversify';
import { AuthService } from './auth-service.js';
import { UsersService } from '../../features/users/users-service.js';
import { SessionsService } from '../sessions/sessions-service.js';
import { UsersQueryRepo } from '../../features/users/users-query-repo.js';

@injectable()
export class AuthController {
  constructor(
    @inject(AuthService) private authService: AuthService,
    @inject(SessionsService) private sessionsService: SessionsService,
    @inject(UsersService) private usersService: UsersService,
    @inject(UsersQueryRepo) private usersQueryRepo: UsersQueryRepo,
  ) {}

  async registration(req: Request, res: Response) {
    const { login, email, password } = req.body;

    const result = await this.usersService.registerUser(login, email, password);

    if (result.status !== RESULT_STATUS.CREATED) {
      res.status(httpCodeByResult(result.status)).json({ errorsMessages: result.extensions });
      return;
    }

    res.status(HTTP_STATUS.NO_CONTENT_204).end();
  }

  async registrationEmailResending(req: Request, res: Response) {
    const { email } = req.body;

    const result = await this.usersService.sendConfirmationCode(email);

    if (result.status !== RESULT_STATUS.NO_CONTENT) {
      res.status(httpCodeByResult(result.status)).json({ errorsMessages: result.extensions });
      return;
    }

    res.status(HTTP_STATUS.NO_CONTENT_204).end();
  }

  async registrationConfirmation(req: Request, res: Response) {
    const code = req.body.code;

    const result = await this.usersService.confirmUser(code);

    if (result.status !== RESULT_STATUS.NO_CONTENT) {
      res.status(httpCodeByResult(result.status)).json({ errorsMessages: result.extensions });
      return;
    }

    res.status(HTTP_STATUS.NO_CONTENT_204).end();
  }

  async sendJwtPair(req: Request, res: Response) {
    const accessToken = res.locals.accessToken;
    const refreshToken = res.locals.refreshToken;
    // console.log('Сервер отправил токен: ' + JSON.stringify(authService.verifyJwt(refreshToken)));

    const cookieExpiration = new Date();
    cookieExpiration.setFullYear(new Date().getFullYear() + 1);

    res
      .status(HTTP_STATUS.OK_200)
      .cookie('refreshToken', refreshToken, {
        expires: cookieExpiration,
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      })
      .json({ accessToken });
  }

  async logout(req: Request, res: Response) {
    // const userId = res.locals.userId;
    const deviceId = res.locals.deviceId;

    await this.sessionsService.deleteDevice(deviceId);

    res.clearCookie('refreshToken').status(HTTP_STATUS.NO_CONTENT_204).end();
  }

  async me(req: Request, res: Response) {
    const userId = res.locals.userId;
    const user = await this.usersQueryRepo.getCurrentUser(userId);
    if (!user) {
      res.status(HTTP_STATUS.UNAUTHORIZED_401).json({ error: 'User not found' });
      return;
    }
    res.status(HTTP_STATUS.OK_200).json(user);
  }

  async passwordRecovery(req: Request, res: Response) {
    const { email } = req.body;
    await this.usersService.sendRecoveryCode(email);

    res.status(HTTP_STATUS.NO_CONTENT_204).end();
  }

  async newPassword(req: Request, res: Response) {
    const newPassword = req.body.newPassword;
    const recoveryCode = req.body.recoveryCode;

    const passwordUpdateResult = await this.usersService.updatePassword(recoveryCode, newPassword);

    if (passwordUpdateResult.status !== RESULT_STATUS.NO_CONTENT) {
      res
        .status(httpCodeByResult(passwordUpdateResult.status))
        .json({ errorsMessages: passwordUpdateResult.extensions });
      return;
    }

    res.status(HTTP_STATUS.NO_CONTENT_204).end();
  }
}
