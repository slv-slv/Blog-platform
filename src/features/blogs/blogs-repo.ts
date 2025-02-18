import { BlogDbType, BlogType } from './blogs-types.js';
import { inject, injectable } from 'inversify';
import { Collection, ObjectId } from 'mongodb';

@injectable()
export class BlogsRepo {
  constructor(@inject('BlogsCollection') private collection: Collection<BlogDbType>) {}

  async createBlog(
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean,
  ): Promise<BlogType> {
    const _id = new ObjectId();
    const newBlog = { name, description, websiteUrl, createdAt, isMembership };
    await this.collection.insertOne({ _id, ...newBlog });
    const id = _id.toString();
    return { id, ...newBlog };
  }

  async updateBlog(id: string, name: string, description: string, websiteUrl: string): Promise<boolean> {
    if (!ObjectId.isValid(id)) {
      return false;
    }
    const _id = new ObjectId(id);
    const updateResult = await this.collection.updateOne(
      { _id },
      { $set: { name, description, websiteUrl } },
    );
    if (!updateResult.matchedCount) {
      return false;
    }
    return true;
  }

  async deleteBlog(id: string): Promise<boolean> {
    if (!ObjectId.isValid(id)) {
      return false;
    }
    const _id = new ObjectId(id);
    const deleteResult = await this.collection.deleteOne({ _id });
    if (!deleteResult.deletedCount) {
      return false;
    }
    return true;
  }
}
