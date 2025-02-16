import { inject, injectable } from 'inversify';
import { Repository } from '../../infrastructure/db/repository.js';
import { IRequestLogsCollection } from '../../infrastructure/db/collections.js';

@injectable()
export class RequestLogsRepo {
  constructor(@inject('RequestLogsCollection') private collection: IRequestLogsCollection) {}

  async addRequest(ip: string, url: string, timestamp: number): Promise<void> {
    const requestLog = { ip, url, timestamp };
    await this.collection.insertOne(requestLog);
  }

  async countRequests(ip: string, url: string, fromTime: number): Promise<number> {
    return await this.collection.countDocuments({ ip, url, timestamp: { $gte: fromTime } });
  }
}
