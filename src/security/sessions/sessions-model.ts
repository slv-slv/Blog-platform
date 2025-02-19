import mongoose from 'mongoose';
import { SETTINGS } from '../../settings.js';
import { DeviceType, SessionType } from './sessions-types.js';

const deviceSchema = new mongoose.Schema<DeviceType>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    ip: { type: String, required: true },
    iat: { type: Number, required: true },
    exp: { type: Number, required: true },
  },
  { versionKey: false },
);

const sessionSchema = new mongoose.Schema<SessionType>(
  {
    userId: { type: String, required: true },
    devices: { type: [deviceSchema], required: true },
  },
  { versionKey: false },
);

export const SessionModel = mongoose.model(SETTINGS.DB_COLLECTIONS.SESSIONS, sessionSchema);
