import { inject, injectable } from 'inversify';
import { RequestLogsRepo } from './request-logs-repo.js';

@injectable()
export class RequestLogsService {
  constructor(@inject(RequestLogsRepo) private requestLogsRepo: RequestLogsRepo) {}

  async addRequest(ip: string, url: string): Promise<void> {
    const timestamp = Date.now();
    await this.requestLogsRepo.addRequest(ip, url, timestamp);
  }

  async shouldBlockRequest(ip: string, url: string): Promise<boolean> {
    const interval = 10;
    const maxRequests = 5;

    const date = new Date();
    date.setSeconds(date.getSeconds() - interval);
    const fromTime = date.getTime();

    const count = await this.requestLogsRepo.countRequests(ip, url, fromTime);
    return count >= maxRequests;
  }
}
