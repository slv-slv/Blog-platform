import { Router } from 'express';
import type { Router as RouterType } from 'express';
import { pagingValidator } from '../../common/validation/paging-params-validation.js';
import { usersValidator } from './users-validation.js';
import { getValidationResult } from '../../common/middleware/get-validation-result.js';
import { basicAuth } from '../../security/middleware/basic-auth.js';
import { container } from '../../ioc/container.js';
import { UsersController } from './users-controller.js';
import { extractPagingParams } from '../../common/middleware/extract-paging-params.js';

export const usersRouter: RouterType = Router();
const usersController = container.get(UsersController);

usersRouter.get(
  '/',
  basicAuth,
  pagingValidator.usersSortBy,
  pagingValidator.sortDirection,
  pagingValidator.pageNumber,
  pagingValidator.pageSize,
  usersValidator.searchLoginTerm,
  usersValidator.searchEmailTerm,
  extractPagingParams,
  usersController.getAllUsers.bind(usersController),
);

usersRouter.post(
  '/',
  basicAuth,
  usersValidator.login,
  usersValidator.password,
  usersValidator.email,
  getValidationResult,
  usersController.createUser.bind(usersController),
);

usersRouter.delete('/:id', basicAuth, usersController.deleteUser.bind(usersController));
