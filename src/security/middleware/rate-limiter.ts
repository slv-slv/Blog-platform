import { NextFunction, Request, Response } from 'express';
import { requestLogsService } from '../../instances/services.js';
import { HTTP_STATUS } from '../../common/types/http-status-codes.js';

export const rateLimiter = async (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip!;
  const url = req.originalUrl;

  if (await requestLogsService.shouldBlockRequest(ip, url)) {
    await requestLogsService.addRequest(ip, url);
    res.status(HTTP_STATUS.TOO_MANY_REQUESTS_429).end();
    return;
  }

  await requestLogsService.addRequest(ip, url);
  next();
};
