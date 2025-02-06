import { MongoMemoryServer } from 'mongodb-memory-server';
import { SETTINGS } from '../../settings.js';
import { MongoCluster } from './mongo-cluster.js';
import { Db } from 'mongodb';
// import { initCollections } from './collections.js';

export const dbName = process.env.NODE_ENV === 'test' ? 'test' : SETTINGS.DB_NAME;
export const mongoUrl = SETTINGS.MONGO_URL;
export const mongoCluster = new MongoCluster(mongoUrl);
export const db = mongoCluster.getDb(dbName);

// export let mongoMemoryServer: MongoMemoryServer;
// export let mongoUrl = SETTINGS.MONGO_URL;
// export let mongoCluster: MongoCluster;
// export let db: Db;

// console.log('NODE_ENV: ' + process.env.NODE_ENV);

// export const initDb = async () => {
//   if (process.env.NODE_ENV === 'test') {
//     mongoMemoryServer = await MongoMemoryServer.create();
//     mongoUrl = mongoMemoryServer.getUri();
//     console.log(mongoUrl);
//     mongoCluster = new MongoCluster(mongoUrl);
//     db = mongoCluster.getDb(dbName);
//     initCollections();
//   }
// };

// export const mongoCluster = new MongoCluster(mongoUrl);
// export const db = mongoCluster.getDb(dbName);
