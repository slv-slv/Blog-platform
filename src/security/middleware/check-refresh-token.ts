import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS } from '../../common/types/http-status-codes.js';
import { container } from '../../ioc/container.js';
import { AuthService } from '../auth/auth-service.js';

const authService = container.get(AuthService);

export const checkRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies.refreshToken;
  // console.log('Сервер получил токен: ' + JSON.stringify(authService.verifyJwt(refreshToken)));

  if (!refreshToken) {
    res.status(HTTP_STATUS.UNAUTHORIZED_401).json({ error: 'Invalid authorization method' });
    return;
  }

  const payload = authService.verifyJwt(refreshToken);
  if (!payload) {
    res.status(HTTP_STATUS.UNAUTHORIZED_401).json({ error: 'Invalid refresh token' });
    return;
  }

  const { userId, deviceId, iat, exp } = payload;

  res.locals.userId = userId;
  res.locals.deviceId = deviceId;
  res.locals.iat = iat;

  next();
};
