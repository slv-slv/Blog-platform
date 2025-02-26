import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS } from '../../common/types/http-status-codes.js';
import { container } from '../../ioc/container.js';
import { RateLimiterService } from './rate-limiter-service.js';

const rateLimiterService = container.get(RateLimiterService);

export const rateLimiter = async (req: Request, res: Response, next: NextFunction) => {
  const ip = req.headers['x-forwarded-for']?.[0] || req.ip!;
  const url = req.originalUrl;

  if (await rateLimiterService.shouldBlockRequest(ip, url)) {
    await rateLimiterService.addRequest(ip, url);
    res.status(HTTP_STATUS.TOO_MANY_REQUESTS_429).end();
    return;
  }

  await rateLimiterService.addRequest(ip, url);
  next();
};
