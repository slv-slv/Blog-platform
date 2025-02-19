import { MongoMemoryServer } from 'mongodb-memory-server';
import { SETTINGS } from '../../settings.js';
import { MongoCluster } from './mongo-cluster.js';

export let mongoMemoryServer: MongoMemoryServer;
export let mongoUri: string;

if (process.env.NODE_ENV === 'test') {
  mongoMemoryServer = await MongoMemoryServer.create();
  mongoUri = mongoMemoryServer.getUri();
} else {
  mongoUri = SETTINGS.MONGO_URL;
}

// console.log('Mongo URL: ', mongoUri);

export const dbName = SETTINGS.DB_NAME;
// export const mongoCluster = new MongoCluster(mongoUri);
// export const db = mongoCluster.getDb(dbName);
