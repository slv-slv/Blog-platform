import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { formatErrors } from '../common/utils/format-errors.js';
import { SETTINGS } from '../settings.js';
import { HTTP_STATUS } from '../common/types/http-status-codes.js';
import { authService } from './auth-service.js';
import { usersQueryRepo } from '../features/users/users-query-repo.js';
import { usersService } from '../features/users/users-service.js';
import { httpCodeByResult, RESULT_STATUS } from '../common/types/result-status-codes.js';

export const authController = {
  sendConfirmation: async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(HTTP_STATUS.BAD_REQUEST_400).json({ errorsMessages: formatErrors(errors) });
      return;
    }

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

    if (await usersService.isConfirmed(email)) {
      res
        .status(HTTP_STATUS.BAD_REQUEST_400)
        .json({ errorsMessages: [{ message: 'Email already confirmed', field: 'email' }] });
    }

    await usersService.registerUser(login, email, password);
    res.status(HTTP_STATUS.NO_CONTENT_204).end();
  },

  resendConfirmation: async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(HTTP_STATUS.BAD_REQUEST_400).json({ errorsMessages: formatErrors(errors) });
      return;
    }

    const { email } = req.body;

    if (!(await usersQueryRepo.findUser(email))) {
      res
        // 404 отсутствует в ТЗ из Swagger
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
  },

  confirmRegistration: async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(HTTP_STATUS.BAD_REQUEST_400).json({ errorsMessages: formatErrors(errors) });
      return;
    }

    const code = req.body.code;
    const confirmationResult = await usersService.confirmUser(code);

    if (confirmationResult.status !== RESULT_STATUS.NO_CONTENT) {
      res
        .status(httpCodeByResult(confirmationResult.status))
        .json({ errorsMessages: confirmationResult.extensions });
      return;
    }

    res.status(HTTP_STATUS.NO_CONTENT_204).end();
  },

  checkPassword: async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(HTTP_STATUS.BAD_REQUEST_400).json({ errorsMessages: formatErrors(errors) });
      return;
    }

    const { loginOrEmail, password } = req.body;

    const isPasswordCorrect = await authService.checkPassword(loginOrEmail, password);
    if (!isPasswordCorrect) {
      res.status(HTTP_STATUS.UNAUTHORIZED_401).json({ error: 'Incorrect login/password' });
      return;
    }

    next();
  },

  issueJWT: async (req: Request, res: Response) => {
    const token = await authService.issueJWT(req.body.loginOrEmail);
    res.status(HTTP_STATUS.OK_200).json({ accessToken: token });
  },

  verifyJWT: async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(HTTP_STATUS.UNAUTHORIZED_401).json({ error: 'Authorization header missing' });
      return;
    }

    const [authMethod, token] = authHeader.split(' ');

    if (authMethod !== 'Bearer' || !token) {
      res.status(HTTP_STATUS.UNAUTHORIZED_401).json({ error: 'Invalid authorization method' });
      return;
    }

    try {
      const jwtPayload = authService.verifyJWT(token);

      if (!jwtPayload) {
        res.status(HTTP_STATUS.UNAUTHORIZED_401).json({ error: 'Invalid access token' });
        return;
      }

      res.locals.jwtPayload = jwtPayload;
      next();
    } catch {
      res.status(HTTP_STATUS.UNAUTHORIZED_401).json({ error: 'Access token verification failed' });
    }
  },

  getCurrentUser: async (req: Request, res: Response) => {
    const jwtPayload = res.locals.jwtPayload;
    const user = await usersQueryRepo.getCurrentUser(jwtPayload.userId);
    res.status(HTTP_STATUS.OK_200).json(user);
  },

  basicAuth: async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(HTTP_STATUS.UNAUTHORIZED_401).json({ error: 'Authorization header missing' });
      return;
    }

    const [authMethod, credsBase64] = authHeader.split(' ');
    const credentials = SETTINGS.CREDENTIALS;

    if (authMethod !== 'Basic' || !credsBase64) {
      res.status(HTTP_STATUS.UNAUTHORIZED_401).json({ error: 'Invalid authorization method' });
      return;
    }

    if (!credentials.map((user) => user.base64).includes(credsBase64)) {
      res.status(HTTP_STATUS.UNAUTHORIZED_401).json({ error: 'Incorrect credentials' });
      return;
    }

    next();
  },
};
