import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { blogsService } from './blogs-service.js';
import { formatErrors } from '../../utils/format-errors.js';
import { blogsViewModelRepo } from './blogs-view-model-repo.js';
import { getPagingParams } from '../../utils/get-paging-params.js';
import { postsViewModelRepo } from '../posts/posts-view-model-repo.js';
import { postsService } from '../posts/posts-service.js';

export const blogsController = {
  getAllBlogs: async (req: Request, res: Response) => {
    const searchNameTerm = (req.query.searchNameTerm as string) ?? null;
    const pagingParams = getPagingParams(req);
    const blogs = await blogsViewModelRepo.getAllBlogs(searchNameTerm, pagingParams);
    res.status(200).json(blogs);
  },

  getPostsByBlogId: async (req: Request, res: Response) => {
    const pagingParams = getPagingParams(req);
    const blogId = req.params.blogId;
    const foundBlog = await blogsViewModelRepo.findBlog(blogId);
    if (!foundBlog) {
      res.status(404).json({ error: 'Blog not found' });
      return;
    }

    const posts = await postsViewModelRepo.getPosts(pagingParams, blogId);
    res.status(200).json(posts);
  },

  findBlog: async (req: Request, res: Response) => {
    const id = req.params.id;
    const foundBlog = await blogsViewModelRepo.findBlog(id);
    if (!foundBlog) {
      res.status(404).json({ error: 'Blog not found' });
      return;
    }
    res.status(200).json(foundBlog);
  },

  createBlog: async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errorsMessages: formatErrors(errors) });
      return;
    }

    const { name, description, websiteUrl } = req.body;
    const newBlog = await blogsService.createBlog(name, description, websiteUrl);
    res.status(201).json(newBlog);
  },

  createPostForBlogId: async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errorsMessages: formatErrors(errors) });
      return;
    }

    const blogId = req.params.blogId;
    const foundBlog = await blogsViewModelRepo.findBlog(blogId);
    if (!foundBlog) {
      res.status(404).json({ error: 'Blog not found' });
      return;
    }

    const { title, shortDescription, content } = req.body;

    const newPost = await postsService.createPost(title, shortDescription, content, blogId);
    res.status(201).json(newPost);
  },

  updateBlog: async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errorsMessages: formatErrors(errors) });
      return;
    }

    const id = req.params.id;
    const { name, description, websiteUrl } = req.body;
    const blogFound = await blogsService.updateBlog(id, name, description, websiteUrl);
    if (!blogFound) {
      res.status(404).json({ error: 'Blog not found' });
      return;
    }

    res.status(204).end();
  },

  deleteBlog: async (req: Request, res: Response) => {
    const id = req.params.id;
    const isDeleted = await blogsService.deleteBlog(id);
    if (!isDeleted) {
      res.status(404).json({ error: 'Blog not found' });
      return;
    }
    res.status(204).end();
  },
};
