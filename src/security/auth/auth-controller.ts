import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS } from '../../common/types/http-status-codes.js';
import { authService, sessionsService, usersService } from '../../instances/services.js';
import { httpCodeByResult, RESULT_STATUS } from '../../common/types/result-status-codes.js';
import { usersQueryRepo } from '../../instances/repositories.js';

export class AuthController {
  async registration(req: Request, res: Response) {
    const { login, email, password } = req.body;

    if (!(await usersService.isLoginUnique(login))) {
      res
        .status(HTTP_STATUS.BAD_REQUEST_400)
        .json({ errorsMessages: [{ message: 'Login already exists', field: 'login' }] });
      return;
    }

    if (!(await usersService.isEmailUnique(email))) {
      res
        .status(HTTP_STATUS.BAD_REQUEST_400)
        .json({ errorsMessages: [{ message: 'Email already exists', field: 'email' }] });
      return;
    }

    await usersService.registerUser(login, email, password);
    res.status(HTTP_STATUS.NO_CONTENT_204).end();
  }

  async registrationEmailResending(req: Request, res: Response) {
    const { email } = req.body;

    if (!(await usersQueryRepo.findUser(email))) {
      res
        .status(HTTP_STATUS.BAD_REQUEST_400)
        .json({ errorsMessages: [{ message: 'Incorrect email', field: 'email' }] });
    }

    if (await usersService.isConfirmed(email)) {
      res
        .status(HTTP_STATUS.BAD_REQUEST_400)
        .json({ errorsMessages: [{ message: 'Email already confirmed', field: 'email' }] });
    }

    await usersService.updateConfirmationCode(email);
    res.status(HTTP_STATUS.NO_CONTENT_204).end();
  }

  async registrationConfirmation(req: Request, res: Response) {
    const code = req.body.code;
    const confirmationResult = await usersService.confirmUser(code);

    if (confirmationResult.status !== RESULT_STATUS.NO_CONTENT) {
      res
        .status(httpCodeByResult(confirmationResult.status))
        .json({ errorsMessages: confirmationResult.extensions });
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
    // const iat = res.locals.iat;

    await sessionsService.deleteDevice(deviceId);

    res
      .cookie('refreshToken', '', {
        expires: new Date(0),
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      })
      .status(HTTP_STATUS.NO_CONTENT_204)
      .end();
  }

  async me(req: Request, res: Response) {
    const userId = res.locals.userId;
    const user = await usersQueryRepo.getCurrentUser(userId);
    if (!user) {
      res.status(HTTP_STATUS.UNAUTHORIZED_401).json({ error: 'User not found' });
      return;
    }
    res.status(HTTP_STATUS.OK_200).json(user);
  }
}
