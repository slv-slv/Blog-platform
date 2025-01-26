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
    const user = await usersViewModelRepo.getCurrentUser(jwtPayload.userId);
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
