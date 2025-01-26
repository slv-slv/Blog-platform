import { MongoClient } from 'mongodb';

export class MongoCluster {
  client: MongoClient;

  constructor(url: string) {
    this.client = new MongoClient(url);
  }

  getClient() {
    return this.client;
  }

  getDb(name: string) {
    return this.client.db(name);
  }

  async run() {
    try {
      await this.client.connect();
      console.log('Connected to MongoDB');
    } catch {
      await this.client.close();
    }
  }
}
