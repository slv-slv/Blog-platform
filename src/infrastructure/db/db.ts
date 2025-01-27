import { SETTINGS } from '../../settings.js';
import { MongoCluster } from './mongo-manager.js';

export const mongoCluster = new MongoCluster(SETTINGS.MONGO_URL);
export const mongoClient = mongoCluster.getClient();
export const db = mongoCluster.getDb(SETTINGS.DB_NAME);

// export const clearDatabase = async (client: MongoClient) => {
//   if (client) {
//     const db = client.db();
//     const collections = await db.collections();

//     for (const collection of collections) {
//       await collection.deleteMany({});
//     }
//   }
// };
