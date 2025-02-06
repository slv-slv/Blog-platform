import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS } from '../../common/types/http-status-codes.js';
import { sessionsQueryRepo, sessionsRepo } from '../../instances/repositories.js';
import { requestLogsService, sessionsService } from '../../instances/services.js';
import { request } from 'http';

export class SessionsController {
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
    const userId = res.locals.userId;
    const deviceId = req.params.deviceId;

    if (!(await sessionsQueryRepo.findDevice(deviceId))) {
      res.status(HTTP_STATUS.NOT_FOUND_404).end();
      return;
    }

    const deviceOwner = await sessionsQueryRepo.getDeviceOwner(deviceId);

    if (deviceOwner !== userId) {
      res.status(HTTP_STATUS.FORBIDDEN_403).end();
      return;
    }

    await sessionsService.deleteDevice(deviceId);
    res.status(HTTP_STATUS.NO_CONTENT_204).end();
  }
}
