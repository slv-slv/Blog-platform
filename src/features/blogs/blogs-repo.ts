import { BlogType } from './blogs-types.js';
import { Repository } from '../../infrastructure/db/repository.js';

export class BlogsRepo extends Repository<BlogType> {
  async createBlog(
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean,
  ): Promise<BlogType> {
    const id = ((await this.collection.countDocuments()) + 1 || 1).toString();
    const newBlog = { id, name, description, websiteUrl, createdAt, isMembership };
    const createResult = await this.collection.insertOne(newBlog);
    const insertedBlog = await this.collection.findOne(
      { _id: createResult.insertedId },
      { projection: { _id: 0 } },
    );
    return insertedBlog as BlogType;
  }

  async updateBlog(id: string, name: string, description: string, websiteUrl: string): Promise<boolean> {
    const updateResult = await this.collection.updateOne({ id }, { $set: { name, description, websiteUrl } });
    if (!updateResult.matchedCount) {
      return false;
    }
    return true;
  }

  async deleteBlog(id: string): Promise<boolean> {
    const deleteResult = await this.collection.deleteOne({ id });
    if (!deleteResult.deletedCount) {
      return false;
    }
    return true;
  }
}
