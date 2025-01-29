import { SETTINGS } from '../../settings.js';
import { MongoCluster } from './mongo-cluster.js';

export const mongoCluster = new MongoCluster(SETTINGS.MONGO_URL);
export const mongoClient = mongoCluster.getClient();
export const db = mongoCluster.getDb(SETTINGS.DB_NAME);
