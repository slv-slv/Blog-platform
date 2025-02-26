import { inject, injectable } from 'inversify';
import { RateLimiterType } from './rate-limiter-types.js';
import { Model } from 'mongoose';

@injectable()
export class RateLimiterRepo {
  constructor(@inject('RateLimiterModel') private model: Model<RateLimiterType>) {}

  async addRequest(ip: string, url: string, timestamp: number): Promise<void> {
    const request = { ip, url, timestamp };
    await this.model.insertOne(request);
  }

  async countRequests(ip: string, url: string, fromTime: number): Promise<number> {
    return await this.model.countDocuments({ ip, url, timestamp: { $gte: fromTime } });
  }
}
