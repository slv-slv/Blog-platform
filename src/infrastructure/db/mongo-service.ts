import { MongoClient } from 'mongodb';

export class MongoService {
  private client: MongoClient = new MongoClient('mongodb://0.0.0.0:27017');

  getDb(dbName: string) {
    return this.client.db(dbName);
  }

  // getCollection(dbName: string, collectionName: string) {
  //   return this.client.db(dbName).collection(collectionName);
  // }

  async run(url: string) {
    try {
      this.client = new MongoClient(url);
      await this.client.connect();
      await this.client.db('admin').command({ ping: 1 });
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
