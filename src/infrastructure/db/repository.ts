import { Collection, Document } from 'mongodb';

export abstract class Repository<T extends Document> {
  constructor(protected collection: Collection<T>) {
    this.collection = collection;
  }
}
