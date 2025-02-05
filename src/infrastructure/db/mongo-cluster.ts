import { MongoClient } from 'mongodb';
import { mongoUrl } from './db.js';

export class MongoCluster {
  private client: MongoClient;

  constructor(url: string) {
    this.client = new MongoClient(url);
  }

  getDb(dbName: string) {
    return this.client.db(dbName);
  }

  // getCollection(dbName: string, collectionName: string) {
  //   return this.client.db(dbName).collection(collectionName);
  // }

  async run() {
    try {
      await this.client.connect();
      await this.client.db('admin').command({ ping: 1 });
      console.log(`Connected to MongoDB: ${mongoUrl}`);
    } catch {
      await this.client.close();
    }
  }

  async stop() {
    await this.client.close();
  }

  async dropDb(dbName: string) {
    const db = this.getDb(dbName);
    const collections = await db.collections();

    for (const collection of collections) {
      await collection.deleteMany({});
    }
  }
}
