import { NextFunction, Request, Response } from 'express';
import { container } from '../../ioc/container.js';
import { SessionsService } from '../sessions/sessions-service.js';

const sessionsService = container.get(SessionsService);

export const createSession = async (req: Request, res: Response, next: NextFunction) => {
  const userId = res.locals.userId;
  const deviceId = res.locals.deviceId;
  const iat = res.locals.iat;
  const exp = res.locals.exp;

  const deviceName = req.get('User-Agent') ?? 'unknown';
  const ip = req.ip!;

  await sessionsService.createSession(userId, deviceId, deviceName, ip, iat, exp);

  next();
};
