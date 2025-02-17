import { PostType } from './posts-types.js';
import { inject, injectable } from 'inversify';
import { BlogsQueryRepo } from '../blogs/blogs-query-repo.js';
import { Collection } from 'mongodb';

@injectable()
export class PostsRepo {
  constructor(
    @inject('PostsCollection') private collection: Collection<PostType>,
    @inject(BlogsQueryRepo) private blogsQueryRepo: BlogsQueryRepo,
  ) {}

  async createPost(
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    createdAt: string,
  ): Promise<PostType> {
    const id = ((await this.collection.countDocuments()) + 1 || 1).toString();
    const blog = await this.blogsQueryRepo.findBlog(blogId);
    const blogName = blog!.name as string;
    const newPost = { id, title, shortDescription, content, blogId, blogName, createdAt };
    const createResult = await this.collection.insertOne(newPost);
    const insertedPost = await this.collection.findOne(
      { _id: createResult.insertedId },
      { projection: { _id: 0 } },
    );
    return insertedPost as PostType;
  }

  async updatePost(id: string, title: string, shortDescription: string, content: string): Promise<boolean> {
    const updateResult = await this.collection.updateOne(
      { id },
      { $set: { title, shortDescription, content } },
    );
    if (!updateResult.matchedCount) {
      return false;
    }
    return true;
  }

  async deletePost(id: string): Promise<boolean> {
    const deleteResult = await this.collection.deleteOne({ id });
    if (!deleteResult.deletedCount) {
      return false;
    }
    return true;
  }
}
