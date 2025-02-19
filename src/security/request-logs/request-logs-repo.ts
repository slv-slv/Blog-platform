import { inject, injectable } from 'inversify';
import { RequestLogType } from './request-logs-types.js';
import { Collection } from 'mongodb';
import { Model } from 'mongoose';

@injectable()
export class RequestLogsRepo {
  constructor(@inject('RequestLogModel') private model: Model<RequestLogType>) {}

  async addRequest(ip: string, url: string, timestamp: number): Promise<void> {
    const requestLog = { ip, url, timestamp };
    await this.model.insertOne(requestLog);
  }

  async countRequests(ip: string, url: string, fromTime: number): Promise<number> {
    return await this.model.countDocuments({ ip, url, timestamp: { $gte: fromTime } });
  }
}
