import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS } from '../common/types/http-status-codes.js';
import { sessionsQueryRepo, sessionsRepo } from '../instances/repositories.js';
import { requestLogsService, sessionsService } from '../instances/services.js';

export class SecurityController {
  async getDevices(req: Request, res: Response) {
    const userId = res.locals.userId;

    const devices = await sessionsQueryRepo.getActiveDevices(userId);
    res.status(HTTP_STATUS.OK_200).json(devices);
  }

  async deleteOtherDevices(req: Request, res: Response) {
    const deviceId = res.locals.deviceId;

    await sessionsService.deleteOtherDevices(deviceId);
    res.status(HTTP_STATUS.NO_CONTENT_204).end();
  }

  async deleteDevice(req: Request, res: Response) {
    const deviceId = req.params.deviceId;

    if (!(await sessionsQueryRepo.findDevice(deviceId))) {
      res.status(HTTP_STATUS.NOT_FOUND_404).end();
      return;
    }

    if (deviceId !== res.locals.deviceId) {
      res.status(HTTP_STATUS.FORBIDDEN_403).end();
      return;
    }

    await sessionsService.deleteDevice(deviceId);
    res.status(HTTP_STATUS.NO_CONTENT_204).end();
  }

  async ipThrottler(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip!;
    const url = req.originalUrl;

    if (await requestLogsService.shouldBlockRequest(ip, url)) {
      res.status(HTTP_STATUS.TOO_MANY_REQUESTS_429).end();
      return;
    }

    next();
  }
}
