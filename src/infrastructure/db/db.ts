import { SETTINGS } from '../../settings.js';
import { MongoCluster } from './mongo-cluster.js';

export const mongoCluster = new MongoCluster(SETTINGS.MONGO_URL);
export const db = mongoCluster.getDb(SETTINGS.DB_NAME);
export const mongoClient = mongoCluster.getClient(); // только для тестов, чтобы открывать/закрывать подключение к БД
