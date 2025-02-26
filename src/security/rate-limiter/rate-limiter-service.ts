import { inject, injectable } from 'inversify';
import { RateLimiterRepo } from './rate-limiter-repo.js';

@injectable()
export class RateLimiterService {
  constructor(@inject(RateLimiterRepo) private rateLimiterRepo: RateLimiterRepo) {}

  async addRequest(ip: string, url: string): Promise<void> {
    const timestamp = Date.now();
    await this.rateLimiterRepo.addRequest(ip, url, timestamp);
  }

  async shouldBlockRequest(ip: string, url: string): Promise<boolean> {
    const interval = 10;
    const maxRequests = 5;

    const date = new Date();
    date.setSeconds(date.getSeconds() - interval);
    const fromTime = date.getTime();

    const count = await this.rateLimiterRepo.countRequests(ip, url, fromTime);
    return count >= maxRequests;
  }
}
