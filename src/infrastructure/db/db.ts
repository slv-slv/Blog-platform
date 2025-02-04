import { MongoMemoryServer } from 'mongodb-memory-server';
import { SETTINGS } from '../../settings.js';
import { MongoCluster } from './mongo-cluster.js';
import { MongoService } from './mongo-service.js';

let uri = SETTINGS.MONGO_URL;
export let dbName = SETTINGS.DB_NAME;

// if (process.env.NODE_ENV === 'test') {
//   const mongoMemoryServer = await MongoMemoryServer.create();
//   uri = mongoMemoryServer.getUri();
// }

export const mongoCluster = new MongoCluster(uri);

if (process.env.NODE_ENV === 'test') {
  dbName = 'test';
}

export const db = mongoCluster.getDb(dbName);

// export const mongoService = new MongoService();
// export const db = mongoService.getDb(SETTINGS.DB_NAME);
