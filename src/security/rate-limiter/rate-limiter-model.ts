import mongoose from 'mongoose';
import { SETTINGS } from '../../settings.js';
import { RateLimiterType } from './rate-limiter-types.js';

const rateLimiterSchema = new mongoose.Schema<RateLimiterType>(
  {
    ip: { type: String, required: true },
    url: { type: String, required: true },
    timestamp: { type: Number, required: true },
  },
  { versionKey: false },
);

export const RateLimiterModel = mongoose.model(SETTINGS.DB_COLLECTIONS.RATE_LIMITER, rateLimiterSchema);
