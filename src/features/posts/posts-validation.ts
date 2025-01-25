import { body } from 'express-validator';
import { blogsViewModelRepo } from '../blogs/blogs-view-model-repo.js';

export const postValidators = {
  blogExists: body('blogId')
    .exists()
    .withMessage('Blog ID is required')
    .isString()
    .withMessage('Blog ID must be a string')
    .trim()
    .notEmpty()
    .withMessage('Blog ID must not be empty')
    .custom(async (blogId) => {
      const blogFound = await blogsViewModelRepo.findBlog(blogId);
      if (!blogFound) {
        throw new Error('Blog does not exist');
      }
      return true;
    })
    .withMessage('Blog does not exist'),

  postTitle: body('title')
    .exists()
    .withMessage('Title is required')
    .isString()
    .withMessage('Title must be a string')
    .trim()
    .notEmpty()
    .withMessage('Title must not be empty')
    .isLength({ max: 30 })
    .withMessage('Name must not be more than 30 characters'),

  postDescription: body('shortDescription')
    .exists()
    .withMessage('Description is required')
    .isString()
    .withMessage('Description must be a string')
    .trim()
    .notEmpty()
    .withMessage('Description must not be empty')
    .isLength({ max: 100 })
    .withMessage('Description must not be more than 100 characters'),

  postContent: body('content')
    .exists()
    .withMessage('Content is required')
    .isString()
    .withMessage('Content must be a string')
    .trim()
    .notEmpty()
    .withMessage('Content must not be empty')
    .isLength({ max: 1000 })
    .withMessage('Content must not be more than 1000 characters'),
};
