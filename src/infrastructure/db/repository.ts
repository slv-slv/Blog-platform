import { db } from './db.js';
import { Document } from 'mongodb';

export class Repository<T extends Document> {
  protected collection;

  constructor(collectionName: string) {
    this.collection = db.collection<T>(collectionName);
  }

  getCollection() {
    return this.collection;
  }
}
