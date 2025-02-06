import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS } from '../../common/types/http-status-codes.js';
import { authService, sessionsService } from '../../instances/services.js';
import { RESULT_STATUS } from '../../common/types/result-status-codes.js';

export const checkNoSession = async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return next();
  }
  const payload = authService.verifyJwt(refreshToken);
  if (!payload) {
    return next();
  }

  const { userId, deviceId, iat } = payload;

  const result = await sessionsService.verifySession(userId, deviceId, iat);

  if (result.status !== RESULT_STATUS.SUCCESS) {
    return next();
  }

  res.status(HTTP_STATUS.UNAUTHORIZED_401).json({ error: 'The user is already logged in' });
};
