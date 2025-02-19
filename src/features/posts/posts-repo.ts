import { PostDbType, PostType } from './posts-types.js';
import { inject, injectable } from 'inversify';
import { BlogsQueryRepo } from '../blogs/blogs-query-repo.js';
import { Collection, ObjectId } from 'mongodb';
import { Model } from 'mongoose';

@injectable()
export class PostsRepo {
  constructor(
    @inject('PostModel') private model: Model<PostDbType>,
    @inject(BlogsQueryRepo) private blogsQueryRepo: BlogsQueryRepo,
  ) {}

  async createPost(
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    createdAt: string,
  ): Promise<PostType> {
    const _id = new ObjectId();
    const blog = await this.blogsQueryRepo.findBlog(blogId);
    const blogName = blog!.name;
    const newPost = { title, shortDescription, content, blogId, blogName, createdAt };
    await this.model.insertOne({ _id, ...newPost });
    const id = _id.toString();
    return { id, ...newPost };
  }

  async updatePost(id: string, title: string, shortDescription: string, content: string): Promise<boolean> {
    if (!ObjectId.isValid(id)) {
      return false;
    }
    const _id = new ObjectId(id);
    const updateResult = await this.model.updateOne({ _id }, { $set: { title, shortDescription, content } });
    if (!updateResult.matchedCount) {
      return false;
    }
    return true;
  }

  async deletePost(id: string): Promise<boolean> {
    if (!ObjectId.isValid(id)) {
      return false;
    }
    const _id = new ObjectId(id);
    const deleteResult = await this.model.deleteOne({ _id });
    if (!deleteResult.deletedCount) {
      return false;
    }
    return true;
  }
}
