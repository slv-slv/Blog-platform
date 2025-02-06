import { requestLogsRepo } from '../../instances/repositories.js';

export class RequestLogsService {
  async addRequest(ip: string, url: string): Promise<void> {
    const timestamp = Date.now();
    await requestLogsRepo.addRequest(ip, url, timestamp);
  }

  async shouldBlockRequest(ip: string, url: string): Promise<boolean> {
    const countIntervalSeconds = 10;
    const maxRequestsPerInterval = 5;

    const date = new Date();
    date.setSeconds(date.getSeconds() - countIntervalSeconds);
    const fromTime = date.getTime();

    const count = await requestLogsRepo.countRequests(ip, url, fromTime);
    return count > maxRequestsPerInterval;
  }
}
