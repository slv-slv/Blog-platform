import { MongoMemoryServer } from 'mongodb-memory-server';
import { SETTINGS } from '../../settings.js';
import { MongoCluster } from './mongo-cluster.js';

export const dbName = SETTINGS.DB_NAME;

export let mongoMemoryServer: MongoMemoryServer;
export let mongoUrl = SETTINGS.MONGO_URL;

console.log('NODE_ENV: ' + process.env.NODE_ENV);

export const initDbUrl = async () => {
  if (process.env.NODE_ENV === 'test') {
    mongoMemoryServer = await MongoMemoryServer.create();
    mongoUrl = mongoMemoryServer.getUri();
  }
};

export const mongoCluster = new MongoCluster(mongoUrl);
export const db = mongoCluster.getDb(dbName);
