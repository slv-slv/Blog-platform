import { NextFunction, Request, Response } from 'express';
import { JwtRefreshPayload } from '../auth/auth-types.js';
import { container } from '../../ioc/container.js';
import { AuthService } from '../auth/auth-service.js';

const authService = container.get(AuthService);

export const generateJwtPair = async (req: Request, res: Response, next: NextFunction) => {
  const userId = res.locals.userId;
  const deviceId = res.locals.deviceId ?? crypto.randomUUID();

  const { accessToken, refreshToken } = await authService.generateJwtPair(userId, deviceId);

  const { iat, exp } = authService.verifyJwt(refreshToken) as JwtRefreshPayload;

  res.locals.deviceId = deviceId;
  res.locals.iat = iat;
  res.locals.exp = exp;

  res.locals.accessToken = accessToken;
  res.locals.refreshToken = refreshToken;

  next();
};
