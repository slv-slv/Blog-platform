import { NextFunction, Request, Response } from 'express';
import { httpCodeByResult, RESULT_STATUS } from '../../common/types/result-status-codes.js';
import { sessionsService } from '../../instances/services.js';

export const checkSession = async (req: Request, res: Response, next: NextFunction) => {
  const userId = res.locals.userId;
  const deviceId = res.locals.deviceId;
  const iat = res.locals.iat;

  const result = await sessionsService.checkSession(userId, deviceId, iat);

  if (result.status !== RESULT_STATUS.SUCCESS) {
    res.status(httpCodeByResult(result.status)).json({ error: 'Invalid refresh token' });
    return;
  }

  next();
};
