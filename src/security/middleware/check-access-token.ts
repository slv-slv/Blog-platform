import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS } from '../../common/types/http-status-codes.js';
import { container } from '../../ioc/container.js';
import { AuthService } from '../auth/auth-service.js';

const authService = container.get(AuthService);

export const checkAccessToken = async (req: Request, res: Response, next: NextFunction) => {
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

  const payload = authService.verifyJwt(token);
  if (!payload) {
    res.status(HTTP_STATUS.UNAUTHORIZED_401).json({ error: 'Invalid access token' });
    return;
  }

  const { userId } = payload;
  res.locals.userId = userId;

  next();
};
