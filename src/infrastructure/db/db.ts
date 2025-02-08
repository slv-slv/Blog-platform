import { MongoMemoryServer } from 'mongodb-memory-server';
import { SETTINGS } from '../../settings.js';
import { MongoCluster } from './mongo-cluster.js';

export const mongoMemoryServer = await MongoMemoryServer.create();
export const url = mongoMemoryServer.getUri();

// export const url = SETTINGS.MONGO_URL;

export const mongoCluster = new MongoCluster(url);

// export const dbName = process.env.NODE_ENV === 'test' ? 'test' : SETTINGS.DB_NAME;
export const dbName = SETTINGS.DB_NAME;

export const db = mongoCluster.getDb(dbName);
