import { Collection, Document } from 'mongodb';

export class Repository<T extends Document> {
  protected collection;

  constructor(collection: Collection<T>) {
    this.collection = collection;
  }
}
