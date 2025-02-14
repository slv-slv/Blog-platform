import { MongoMemoryServer } from 'mongodb-memory-server';
import { SETTINGS } from '../../settings.js';
import { MongoCluster } from './mongo-cluster.js';

export let mongoMemoryServer: MongoMemoryServer;
let url: string;

if (process.env.NODE_ENV === 'test') {
  mongoMemoryServer = await MongoMemoryServer.create();
  url = mongoMemoryServer.getUri();
} else {
  url = SETTINGS.MONGO_URL;
}

// console.log('Mongo URL: ', url);

export const mongoCluster = new MongoCluster(url);

export const dbName = SETTINGS.DB_NAME;
export const db = mongoCluster.getDb(dbName);
