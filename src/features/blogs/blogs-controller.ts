import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { blogsService } from './blogs-service.js';
import { formatErrors } from '../../common/utils/format-errors.js';
import { blogsQueryRepo } from './blogs-query-repo.js';
import { getPagingParams } from '../../common/utils/get-paging-params.js';
import { postsQueryRepo } from '../posts/posts-query-repo.js';
import { postsService } from '../posts/posts-service.js';
import { HTTP_STATUS } from '../../common/types/http-status-codes.js';

export const blogsController = {
  getAllBlogs: async (req: Request, res: Response) => {
    const searchNameTerm = (req.query.searchNameTerm as string) ?? null;
    const pagingParams = getPagingParams(req);
    const blogs = await blogsQueryRepo.getAllBlogs(searchNameTerm, pagingParams);
    res.status(HTTP_STATUS.OK_200).json(blogs);
  },

  getPostsByBlogId: async (req: Request, res: Response) => {
    const pagingParams = getPagingParams(req);
    const blogId = req.params.blogId;
    const blog = await blogsQueryRepo.findBlog(blogId);
    if (!blog) {
      res.status(HTTP_STATUS.NOT_FOUND_404).json({ error: 'Blog not found' });
      return;
    }

    const posts = await postsQueryRepo.getPosts(pagingParams, blogId);
    res.status(HTTP_STATUS.OK_200).json(posts);
  },

  findBlog: async (req: Request, res: Response) => {
    const id = req.params.id;
    const blog = await blogsQueryRepo.findBlog(id);
    if (!blog) {
      res.status(HTTP_STATUS.NOT_FOUND_404).json({ error: 'Blog not found' });
      return;
    }
    res.status(HTTP_STATUS.OK_200).json(blog);
  },

  createBlog: async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(HTTP_STATUS.BAD_REQUEST_400).json({ errorsMessages: formatErrors(errors) });
      return;
    }

    const { name, description, websiteUrl } = req.body;
    const newBlog = await blogsService.createBlog(name, description, websiteUrl);
    res.status(HTTP_STATUS.CREATED_201).json(newBlog);
  },

  createPostForBlog: async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(HTTP_STATUS.BAD_REQUEST_400).json({ errorsMessages: formatErrors(errors) });
      return;
    }

    const blogId = req.params.blogId;
    const blog = await blogsQueryRepo.findBlog(blogId);
    if (!blog) {
      res.status(HTTP_STATUS.NOT_FOUND_404).json({ error: 'Blog not found' });
      return;
    }

    const { title, shortDescription, content } = req.body;

    const newPost = await postsService.createPost(title, shortDescription, content, blogId);
    res.status(HTTP_STATUS.CREATED_201).json(newPost);
  },

  updateBlog: async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(HTTP_STATUS.BAD_REQUEST_400).json({ errorsMessages: formatErrors(errors) });
      return;
    }

    const id = req.params.id;
    const { name, description, websiteUrl } = req.body;
    const isUpdated = await blogsService.updateBlog(id, name, description, websiteUrl);
    if (!isUpdated) {
      res.status(HTTP_STATUS.NOT_FOUND_404).json({ error: 'Blog not found' });
      return;
    }

    res.status(HTTP_STATUS.NO_CONTENT_204).end();
  },

  deleteBlog: async (req: Request, res: Response) => {
    const id = req.params.id;
    const isDeleted = await blogsService.deleteBlog(id);
    if (!isDeleted) {
      res.status(HTTP_STATUS.NOT_FOUND_404).json({ error: 'Blog not found' });
      return;
    }
    res.status(HTTP_STATUS.NO_CONTENT_204).end();
  },
};
