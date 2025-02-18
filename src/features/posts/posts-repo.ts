import { PostDbType, PostType } from './posts-types.js';
import { inject, injectable } from 'inversify';
import { BlogsQueryRepo } from '../blogs/blogs-query-repo.js';
import { Collection, ObjectId } from 'mongodb';

@injectable()
export class PostsRepo {
  constructor(
    @inject('PostsCollection') private collection: Collection<PostDbType>,
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
    await this.collection.insertOne({ _id, ...newPost });
    const id = _id.toString();
    return { id, ...newPost };
  }

  async updatePost(id: string, title: string, shortDescription: string, content: string): Promise<boolean> {
    if (!ObjectId.isValid(id)) {
      return false;
    }
    const _id = new ObjectId(id);
    const updateResult = await this.collection.updateOne(
      { _id },
      { $set: { title, shortDescription, content } },
    );
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
    const deleteResult = await this.collection.deleteOne({ _id });
    if (!deleteResult.deletedCount) {
      return false;
    }
    return true;
  }
}
