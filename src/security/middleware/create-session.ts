import { NextFunction, Request, Response } from 'express';
import { container } from '../../ioc/container.js';
import { SessionsService } from '../sessions/sessions-service.js';

const sessionsService = container.get(SessionsService);

export const createSession = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.userId!;
  const deviceId = req.deviceId!;
  const iat = req.iat!;
  const exp = req.exp!;

  const deviceName = req.get('User-Agent') ?? 'unknown';
  const ip = req.ip ?? 'unknown';

  await sessionsService.createSession(userId, deviceId, deviceName, ip, iat, exp);

  next();
};
