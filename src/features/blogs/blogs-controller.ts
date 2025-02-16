import { Request, Response } from 'express';
import { getPagingParams } from '../../common/utils/get-paging-params.js';
import { HTTP_STATUS } from '../../common/types/http-status-codes.js';
import { inject, injectable } from 'inversify';
import { BlogsQueryRepo } from './blogs-query-repo.js';
import { PostsQueryRepo } from '../posts/posts-query-repo.js';
import { BlogsService } from './blogs-service.js';
import { PostsService } from '../posts/posts-service.js';

@injectable()
export class BlogsController {
  constructor(
    @inject(BlogsQueryRepo) private blogsQueryRepo: BlogsQueryRepo,
    @inject(PostsQueryRepo) private postsQueryRepo: PostsQueryRepo,
    @inject(BlogsService) private blogsService: BlogsService,
    @inject(PostsService) private postsService: PostsService,
  ) {}

  async getAllBlogs(req: Request, res: Response) {
    const searchNameTerm = (req.query.searchNameTerm as string) ?? null;
    const pagingParams = getPagingParams(req);
    const blogs = await this.blogsQueryRepo.getAllBlogs(searchNameTerm, pagingParams);
    res.status(HTTP_STATUS.OK_200).json(blogs);
  }

  async getPostsByBlogId(req: Request, res: Response) {
    const pagingParams = getPagingParams(req);
    const blogId = req.params.blogId;
    const blog = await this.blogsQueryRepo.findBlog(blogId);
    if (!blog) {
      res.status(HTTP_STATUS.NOT_FOUND_404).json({ error: 'Blog not found' });
      return;
    }

    const posts = await this.postsQueryRepo.getPosts(pagingParams, blogId);
    res.status(HTTP_STATUS.OK_200).json(posts);
  }

  async findBlog(req: Request, res: Response) {
    const id = req.params.id;
    const blog = await this.blogsQueryRepo.findBlog(id);
    if (!blog) {
      res.status(HTTP_STATUS.NOT_FOUND_404).json({ error: 'Blog not found' });
      return;
    }
    res.status(HTTP_STATUS.OK_200).json(blog);
  }

  async createBlog(req: Request, res: Response) {
    const { name, description, websiteUrl } = req.body;
    const newBlog = await this.blogsService.createBlog(name, description, websiteUrl);
    res.status(HTTP_STATUS.CREATED_201).json(newBlog);
  }

  async createPostForBlog(req: Request, res: Response) {
    const blogId = req.params.blogId;
    const blog = await this.blogsQueryRepo.findBlog(blogId);
    if (!blog) {
      res.status(HTTP_STATUS.NOT_FOUND_404).json({ error: 'Blog not found' });
      return;
    }

    const { title, shortDescription, content } = req.body;

    const newPost = await this.postsService.createPost(title, shortDescription, content, blogId);
    res.status(HTTP_STATUS.CREATED_201).json(newPost);
  }

  async updateBlog(req: Request, res: Response) {
    const id = req.params.id;
    const { name, description, websiteUrl } = req.body;
    const isUpdated = await this.blogsService.updateBlog(id, name, description, websiteUrl);
    if (!isUpdated) {
      res.status(HTTP_STATUS.NOT_FOUND_404).json({ error: 'Blog not found' });
      return;
    }

    res.status(HTTP_STATUS.NO_CONTENT_204).end();
  }

  async deleteBlog(req: Request, res: Response) {
    const id = req.params.id;
    const isDeleted = await this.blogsService.deleteBlog(id);
    if (!isDeleted) {
      res.status(HTTP_STATUS.NOT_FOUND_404).json({ error: 'Blog not found' });
      return;
    }
    res.status(HTTP_STATUS.NO_CONTENT_204).end();
  }
}
