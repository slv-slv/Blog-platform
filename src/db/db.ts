import { MongoClient } from 'mongodb';
import { SETTINGS } from '../settings.js';

export const dbClient = new MongoClient(SETTINGS.MONGO_URL);
export const db = dbClient.db(SETTINGS.DB_NAME);

export const runDb = async (client: MongoClient) => {
  try {
    await client.connect();
    await db.command({ ping: 1 });
    console.log('Connected to MongoDB');
  } catch (dbError) {
    await client.close();
    throw dbError;
  }
};
