import { Request, Response } from 'express';
import { getPagingParams } from '../../common/utils/get-paging-params.js';
import { HTTP_STATUS } from '../../common/types/http-status-codes.js';
import { inject, injectable } from 'inversify';
import { BlogsQueryRepo } from './blogs-query-repo.js';
import { PostsQueryRepo } from '../posts/posts-query-repo.js';
import { BlogsService } from './blogs-service.js';
import { PostsService } from '../posts/posts-service.js';
import { httpCodeByResult, RESULT_STATUS } from '../../common/types/result-status-codes.js';
import { BlogsRepo } from './blogs-repo.js';

@injectable()
export class BlogsController {
  constructor(
    @inject(BlogsRepo) private blogsRepo: BlogsRepo,
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
    const userId = res.locals.userId;

    const blog = await this.blogsRepo.findBlog(blogId);
    if (!blog) {
      res.status(HTTP_STATUS.NOT_FOUND_404).json({ error: 'Blog not found' });
      return;
    }

    const posts = await this.postsQueryRepo.getPosts(userId, pagingParams, blogId);
    res.status(HTTP_STATUS.OK_200).json(posts);
  }

  async findBlog(req: Request, res: Response) {
    const id = req.params.id;
    const blog = await this.blogsRepo.findBlog(id);
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
    const { title, shortDescription, content } = req.body;

    const result = await this.postsService.createPost(title, shortDescription, content, blogId);

    if (result.status !== RESULT_STATUS.CREATED) {
      res.status(httpCodeByResult(result.status)).json(result.extensions);
      return;
    }

    res.status(HTTP_STATUS.CREATED_201).json(result.data);
  }

  async updateBlog(req: Request, res: Response) {
    const id = req.params.id;
    const { name, description, websiteUrl } = req.body;
    const result = await this.blogsService.updateBlog(id, name, description, websiteUrl);
    if (result.status !== RESULT_STATUS.NO_CONTENT) {
      res.status(httpCodeByResult(result.status)).json(result.extensions);
      return;
    }

    res.status(HTTP_STATUS.NO_CONTENT_204).end();
  }

  async deleteBlog(req: Request, res: Response) {
    const id = req.params.id;
    const result = await this.blogsService.deleteBlog(id);
    if (result.status !== RESULT_STATUS.NO_CONTENT) {
      res.status(httpCodeByResult(result.status)).json(result.extensions);
      return;
    }

    res.status(HTTP_STATUS.NO_CONTENT_204).end();
  }
}
