import { Router } from 'express';
import { usersController } from './users-controller.js';
import { authController } from '../../auth/auth-controller.js';
import { pagingValidator } from '../../common/validation/paging-params-validation.js';
import { usersValidator } from './users-validation.js';

export const usersRouter = Router();

usersRouter.get(
  '/',
  authController.verifyBasicAuth,
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
  authController.verifyBasicAuth,
  usersValidator.login,
  usersValidator.newPassword,
  usersValidator.email,
  usersController.createUser,
);

usersRouter.delete('/:id', authController.verifyBasicAuth, usersController.deleteUser);
