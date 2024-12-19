import { body } from 'express-validator';
import { findBlogDb } from '../data-access/blogs-db-access.js';

export const postTitleValidation = body('title')
  .exists()
  .withMessage('Title is required')
  .isString()
  .withMessage('Title must be a string')
  .trim()
  .notEmpty()
  .withMessage('Title must not be empty')
  .isLength({ max: 30 })
  .withMessage('Name must not be more than 30 characters');

export const postDescriptionValidation = body('shortDescription')
  .exists()
  .withMessage('Description is required')
  .isString()
  .withMessage('Description must be a string')
  .trim()
  .notEmpty()
  .withMessage('Description must not be empty')
  .isLength({ max: 100 })
  .withMessage('Description must not be more than 100 characters');

export const postContentValidation = body('content')
  .exists()
  .withMessage('Content is required')
  .isString()
  .withMessage('Content must be a string')
  .trim()
  .notEmpty()
  .withMessage('Content must not be empty')
  .isLength({ max: 1000 })
  .withMessage('Content must not be more than 1000 characters');

export const blogExistsValidation = body('blogId')
  .exists()
  .withMessage('Blog ID is required')
  .isString()
  .withMessage('Blog ID must be a string')
  .trim()
  .notEmpty()
  .withMessage('Blog ID must not be empty')
  .custom((id) => {
    if (!findBlogDb(id)) {
      return false;
    }
    return true;
  })
  .withMessage('Blog does not exist');
