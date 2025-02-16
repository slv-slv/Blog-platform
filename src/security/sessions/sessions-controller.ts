import { Request, Response } from 'express';
import { HTTP_STATUS } from '../../common/types/http-status-codes.js';
import { inject, injectable } from 'inversify';
import { SessionsService } from './sessions-service.js';
import { SessionsQueryRepo } from './sessions-query-repo.js';

@injectable()
export class SessionsController {
  constructor(
    @inject(SessionsService) private sessionsService: SessionsService,
    @inject(SessionsQueryRepo) private sessionsQueryRepo: SessionsQueryRepo,
  ) {}

  async getDevices(req: Request, res: Response) {
    const userId = res.locals.userId;

    const devices = await this.sessionsQueryRepo.getActiveDevices(userId);
    res.status(HTTP_STATUS.OK_200).json(devices);
  }

  async deleteOtherDevices(req: Request, res: Response) {
    const deviceId = res.locals.deviceId;

    await this.sessionsService.deleteOtherDevices(deviceId);
    res.status(HTTP_STATUS.NO_CONTENT_204).end();
  }

  async deleteDevice(req: Request, res: Response) {
    const userId = res.locals.userId;
    const deviceId = req.params.deviceId;

    if (!(await this.sessionsQueryRepo.findDevice(deviceId))) {
      res.status(HTTP_STATUS.NOT_FOUND_404).end();
      return;
    }

    const deviceOwner = await this.sessionsQueryRepo.getDeviceOwner(deviceId);

    if (deviceOwner !== userId) {
      res.status(HTTP_STATUS.FORBIDDEN_403).end();
      return;
    }

    await this.sessionsService.deleteDevice(deviceId);
    res.status(HTTP_STATUS.NO_CONTENT_204).end();
  }
}
