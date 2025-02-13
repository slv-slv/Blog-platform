import { NextFunction, Request, Response } from 'express';
import { authService } from '../../instances/services.js';

export const generateJwtPair = async (req: Request, res: Response, next: NextFunction) => {
  const userId = res.locals.userId;
  const deviceId = res.locals.deviceId ?? crypto.randomUUID();

  const { accessToken, refreshToken } = await authService.generateJwtPair(userId, deviceId);

  res.locals.accessToken = accessToken;
  res.locals.refreshToken = refreshToken;

  next();
};
