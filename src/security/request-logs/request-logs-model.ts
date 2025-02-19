import mongoose from 'mongoose';
import { SETTINGS } from '../../settings.js';

export type RequestLogType = {
  ip: string;
  url: string;
  timestamp: number;
};

const requestLogSchema = new mongoose.Schema<RequestLogType>(
  {
    ip: { type: String, required: true },
    url: { type: String, required: true },
    timestamp: { type: Number, required: true },
  },
  { versionKey: false },
);

export const RequestLogModel = mongoose.model(SETTINGS.DB_COLLECTIONS.REQUEST_LOGS, requestLogSchema);
