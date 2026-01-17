import { NextFunction, Request, Response } from 'express';
import { httpCodeByResult, RESULT_STATUS } from '../../common/types/result-status-codes.js';
import { container } from '../../ioc/container.js';
import { SessionsService } from '../sessions/sessions-service.js';

const sessionsService = container.get(SessionsService);

export const checkSession = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.userId!;
  const deviceId = req.deviceId!;
  const iat = req.iat!;

  const result = await sessionsService.checkSession(userId, deviceId, iat);

  if (result.status !== RESULT_STATUS.SUCCESS) {
    res.status(httpCodeByResult(result.status)).json({ error: 'Invalid refresh token' });
    return;
  }

  next();
};
