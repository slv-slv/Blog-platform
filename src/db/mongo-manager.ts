import { MongoClient } from 'mongodb';

export class MongoCluster {
  client: MongoClient;

  constructor(url: string) {
    this.client = new MongoClient(url);
  }

  async run() {
    try {
      await this.client.connect();
      console.log('Connected to MongoDB');
    } catch {
      await this.client.close();
    }
  }

  getClient() {
    return this.client;
  }

  getDb(name: string) {
    return this.client.db(name);
  }

  async dropDb(name: string) {
    const db = this.getDb(name);
    const collections = await db.collections();

    for (const collection of collections) {
      await collection.deleteMany({});
    }
  }
}
