import { PostDbType, PostType } from './posts-types.js';
import { inject, injectable } from 'inversify';
import { Model } from 'mongoose';
import { BlogsRepo } from '../blogs/blogs-repo.js';
import { ObjectId } from 'mongodb';

@injectable()
export class PostsRepo {
  constructor(
    @inject('PostModel') private model: Model<PostDbType>,
    @inject(BlogsRepo) private blogsRepo: BlogsRepo,
  ) {}

  async findPost(id: string): Promise<PostType | null> {
    if (!ObjectId.isValid(id)) {
      return null;
    }
    const _id = new ObjectId(id);
    const post = await this.model.findOne({ _id }, { _id: 0 }).lean();
    if (!post) {
      return null;
    }
    return { id, ...post };
  }

  async createPost(
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    createdAt: string,
  ): Promise<PostType | null> {
    const _id = new ObjectId();

    const blog = await this.blogsRepo.findBlog(blogId);
    if (!blog) return null;

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
