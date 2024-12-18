import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { createBlogDb } from '../data-access/blogs-db-access.js';
import { blogDescriptionValidation, blogNameValidation, blogUrlValidation } from './blogs-validation.js';

export const createBlog = [
  blogNameValidation,
  blogDescriptionValidation,
  blogUrlValidation,
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }
    const newBlog = createBlogDb(req.body);
    res.status(201).json({ newBlog });
  },
];
