import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { formatErrors } from '../common/utils/format-errors.js';
import { SETTINGS } from '../settings.js';
import { HTTP_STATUS } from '../common/types/http-status-codes.js';
import { authService } from './auth-service.js';
import { usersViewModelRepo } from '../features/users/users-view-model-repo.js';

export const authController = {
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
    let isAuth = false;

    if (authHeader) {
      const [authMethod, token] = authHeader.split(' ');
      const jwtPayload = authService.verifyJWT(token);
      res.locals.jwtPayload = jwtPayload;
      isAuth = authMethod === 'Bearer' && jwtPayload !== null;
    }

    if (!authHeader || !isAuth) {
      res.status(HTTP_STATUS.UNAUTHORIZED_401).json({ error: 'Unsuccessful authorization' });
      return;
    }

    next();
  },

  getCurrentUser: async (req: Request, res: Response) => {
    const jwtPayload = res.locals.jwtPayload;
    const user = await usersViewModelRepo.getCurrentUser(jwtPayload.userId);
    res.status(HTTP_STATUS.OK_200).json(user);
  },

  basicAuth: async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const credentials = SETTINGS.CREDENTIALS;
    let isAuth = false;

    if (authHeader) {
      const [authMethod, credsBase64] = authHeader.split(' ');
      isAuth = authMethod === 'Basic' && credentials.map((user) => user.base64).includes(credsBase64);
    }

    if (!authHeader || !isAuth) {
      res.status(HTTP_STATUS.UNAUTHORIZED_401).json({ error: 'Unsuccessful authorization' });
      return;
    }

    next();
  },
};
