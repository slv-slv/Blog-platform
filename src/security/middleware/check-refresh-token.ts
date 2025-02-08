import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS } from '../../common/types/http-status-codes.js';
import { httpCodeByResult, RESULT_STATUS } from '../../common/types/result-status-codes.js';
import { authService, sessionsService } from '../../instances/services.js';

export const checkRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res.status(HTTP_STATUS.UNAUTHORIZED_401).json({ error: 'Invalid authorization method' });
    return;
  }

  const payload = authService.verifyJwt(refreshToken);
  if (!payload) {
    res.status(HTTP_STATUS.UNAUTHORIZED_401).json({ error: 'Invalid refresh token' });
    return;
  }

  const { userId, deviceId, iat } = payload;
  const result = await sessionsService.checkSession(userId, deviceId, iat);

  if (result.status !== RESULT_STATUS.SUCCESS) {
    res.status(httpCodeByResult(result.status)).json({ error: 'Invalid refresh token' });
    return;
  }

  res.locals.userId = userId;
  res.locals.deviceId = deviceId;
  // res.locals.iat = iat;

  next();
};
