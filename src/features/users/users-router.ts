import { Router } from 'express';
import { pagingValidator } from '../../common/validation/paging-params-validation.js';
import { usersValidator } from './users-validation.js';
import { usersController } from '../../instances/controllers.js';
import { getValidationResult } from '../../common/middleware/get-validation-result.js';
import { basicAuth } from '../../security/middleware/basic-auth.js';

export const usersRouter = Router();

usersRouter.get(
  '/',
  basicAuth,
  pagingValidator.usersSortBy,
  pagingValidator.sortDirection,
  pagingValidator.pageNumber,
  pagingValidator.pageSize,
  usersValidator.searchLoginTerm,
  usersValidator.searchEmailTerm,
  usersController.getAllUsers,
);

usersRouter.post(
  '/',
  basicAuth,
  usersValidator.login,
  usersValidator.password,
  usersValidator.email,
  getValidationResult,
  usersController.createUser,
);

usersRouter.delete('/:id', basicAuth, usersController.deleteUser);
