import { Repository } from '../../infrastructure/db/repository.js';
import { RequestLogType } from './request-logs-types.js';

export class RequestLogsRepo extends Repository<RequestLogType> {
  async addRequest(ip: string, url: string, timestamp: number): Promise<void> {
    const requestLog = { ip, url, timestamp };
    await this.collection.insertOne(requestLog);
  }

  async countRequests(ip: string, url: string, fromTime: number): Promise<number> {
    return await this.collection.countDocuments({ ip, url, timestamp: { $gte: fromTime } });
  }
}
