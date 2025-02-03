import { MongoClient } from 'mongodb';

export class MongoCluster {
  private client: MongoClient;

  constructor(url: string) {
    this.client = new MongoClient(url);
  }

  getClient() {
    return this.client;
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
      console.log('Connected to MongoDB');
    } catch {
      await this.client.close();
    }
  }

  async dropDb(dbName: string) {
    const db = this.getDb(dbName);
    const collections = await db.collections();

    for (const collection of collections) {
      await collection.deleteMany({});
    }
  }
}
