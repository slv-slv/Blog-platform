import { inject, injectable } from 'inversify';
import { RequestLogType } from './request-logs-types.js';
import { Collection } from 'mongodb';

@injectable()
export class RequestLogsRepo {
  constructor(@inject('RequestLogsCollection') private collection: Collection<RequestLogType>) {}

  async addRequest(ip: string, url: string, timestamp: number): Promise<void> {
    const requestLog = { ip, url, timestamp };
    await this.collection.insertOne(requestLog);
  }

  async countRequests(ip: string, url: string, fromTime: number): Promise<number> {
    return await this.collection.countDocuments({ ip, url, timestamp: { $gte: fromTime } });
  }
}
