import { MongoMemoryServer } from 'mongodb-memory-server';
import { SETTINGS } from '../../settings.js';
import { MongoCluster } from './mongo-cluster.js';

export const dbName = process.env.NODE_ENV === 'test' ? 'test' : SETTINGS.DB_NAME;
export const mongoMemoryServer = await MongoMemoryServer.create();
export const mongoUrl = mongoMemoryServer.getUri();
// export const mongoUrl = SETTINGS.MONGO_URL;
export const mongoCluster = new MongoCluster(mongoUrl);
export const db = mongoCluster.getDb(dbName);
