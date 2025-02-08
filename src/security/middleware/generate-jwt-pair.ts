import { NextFunction, Request, Response } from 'express';
import { authService } from '../../instances/services.js';

export const generateJwtPair = async (req: Request, res: Response, next: NextFunction) => {
  const userId = res.locals.userId;
  const deviceId = res.locals.deviceId ?? crypto.randomUUID();
  const deviceName = req.get('User-Agent') ?? 'unknown';
  const ip = req.ip!;

  const { accessToken, refreshToken } = await authService.generateJwtPair(userId, deviceId, deviceName, ip);

  // console.log('Сгенерировал: ' + accessToken);
  console.log('payload: ' + authService.verifyJwt(accessToken));
  // console.log('Сгенерировал: ' + refreshToken);
  console.log('payload: ' + authService.verifyJwt(refreshToken));

  res.locals.accessToken = accessToken;
  res.locals.refreshToken = refreshToken;

  next();
};
